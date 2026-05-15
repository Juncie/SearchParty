import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { env } from '#/env'

/** Value stored on `resumes.storage_provider` for Cloudflare R2. */
export const R2_STORAGE_PROVIDER = 'r2' as const

const PRESIGNED_PUT_SECONDS = 15 * 60
const PRESIGNED_GET_SECONDS = 5 * 60

const R2_ENV_HINT =
  'Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY (or R2_API_TOKEN), and R2_BUCKET_NAME.'

function r2SecretAccessKey(): string | undefined {
  return env.R2_SECRET_ACCESS_KEY ?? env.R2_API_TOKEN
}

function listMissingR2Variables(): string[] {
  const missing: string[] = []
  if (!env.R2_ACCOUNT_ID?.trim()) {
    missing.push('R2_ACCOUNT_ID')
  }
  if (!env.R2_ACCESS_KEY_ID?.trim()) {
    missing.push('R2_ACCESS_KEY_ID')
  }
  if (!r2SecretAccessKey()?.trim()) {
    missing.push('R2_SECRET_ACCESS_KEY or R2_API_TOKEN')
  }
  if (!env.R2_BUCKET_NAME?.trim()) {
    missing.push('R2_BUCKET_NAME')
  }
  return missing
}

export function isR2Configured(): boolean {
  return listMissingR2Variables().length === 0
}

/** Human-readable configuration error (for 503 responses when R2 is incomplete). */
export function describeR2MissingConfiguration(): string {
  return new R2ConfigurationError(listMissingR2Variables()).message
}

/** Thrown when required R2 env vars are absent before any S3 call. */
export class R2ConfigurationError extends Error {
  readonly missingVariables: readonly string[]

  constructor(missingVariables: readonly string[]) {
    const detail =
      missingVariables.length > 0
        ? `Missing: ${missingVariables.join(', ')}. ${R2_ENV_HINT}`
        : R2_ENV_HINT
    super(`R2 is not configured. ${detail}`)
    this.name = 'R2ConfigurationError'
    this.missingVariables = missingVariables
  }
}

/** Thrown when an R2 / S3 operation fails after configuration checks pass. */
export class R2OperationError extends Error {
  readonly operation: string
  readonly httpStatusCode?: number

  constructor(
    operation: string,
    message: string,
    options?: { cause?: unknown; httpStatusCode?: number },
  ) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined)
    this.name = 'R2OperationError'
    this.operation = operation
    this.httpStatusCode = options?.httpStatusCode
  }
}

type AwsLikeParts = {
  name?: string
  message: string
  httpStatusCode?: number
  requestId?: string
}

function extractAwsLikeError(error: unknown): AwsLikeParts {
  if (typeof error === 'object' && error !== null) {
    const e = error as Record<string, unknown>
    const metadata = e.$metadata as
      | { httpStatusCode?: number; requestId?: string }
      | undefined
    return {
      name: typeof e.name === 'string' ? e.name : undefined,
      message:
        typeof e.message === 'string' && e.message.trim().length > 0
          ? e.message
          : 'Unknown error from storage.',
      httpStatusCode: metadata?.httpStatusCode,
      requestId: metadata?.requestId,
    }
  }
  return { message: typeof error === 'string' ? error : String(error) }
}

/**
 * Produces a short, operator-facing message for logs and API responses.
 * Avoids echoing full XML bodies from the AWS SDK.
 */
export function describeR2OperationFailure(
  operation: string,
  error: unknown,
): string {
  const parts = extractAwsLikeError(error)
  const { name, message, httpStatusCode, requestId } = parts
  const req = requestId ? ` Request ID: ${requestId}.` : ''

  if (name === 'InvalidAccessKeyId' || name === 'SignatureDoesNotMatch') {
    return `R2 ${operation} failed: credentials were rejected (${name}). Check R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY (or R2_API_TOKEN).${req}`
  }

  if (
    name === 'AccessDenied' ||
    httpStatusCode === 403 ||
    message.includes('Access Denied')
  ) {
    return `R2 ${operation} failed: access denied. Confirm the R2 API token can read/write the bucket.${req}`
  }

  if (name === 'NoSuchBucket' || message.includes('NoSuchBucket')) {
    return `R2 ${operation} failed: bucket not found. Verify R2_BUCKET_NAME and R2_ACCOUNT_ID.${req}`
  }

  if (httpStatusCode === 404 || name === 'NotFound' || name === 'NoSuchKey') {
    return `R2 ${operation} failed: object or bucket endpoint returned 404.${req}`
  }

  if (
    message.includes('ENOTFOUND') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ETIMEDOUT') ||
    message.includes('fetch failed')
  ) {
    return `R2 ${operation} failed: could not reach R2 (network). Check R2_ACCOUNT_ID and connectivity.${req}`
  }

  const label = name ? `${name}: ` : ''
  return `R2 ${operation} failed: ${label}${message}${req}`
}

function throwR2OperationError(operation: string, error: unknown): never {
  const parts = extractAwsLikeError(error)
  throw new R2OperationError(
    operation,
    describeR2OperationFailure(operation, error),
    { cause: error, httpStatusCode: parts.httpStatusCode },
  )
}

let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  const missing = listMissingR2Variables()
  if (missing.length > 0) {
    throw new R2ConfigurationError(missing)
  }
  if (!s3Client) {
    s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID!,
        secretAccessKey: r2SecretAccessKey()!,
      },
      forcePathStyle: true,
    })
  }
  return s3Client
}

function bucket(): string {
  const name = env.R2_BUCKET_NAME?.trim()
  if (!name) {
    throw new R2ConfigurationError(listMissingR2Variables())
  }
  return name
}

export async function getPresignedResumePutUrl(options: {
  storageKey: string
  mimeType: string
  sizeBytes: number
}): Promise<{ uploadUrl: string; expiresInSeconds: number }> {
  try {
    const client = getS3Client()
    const command = new PutObjectCommand({
      Bucket: bucket(),
      Key: options.storageKey,
      ContentType: options.mimeType,
      ContentLength: options.sizeBytes,
    })
    const uploadUrl = await getSignedUrl(client, command, {
      expiresIn: PRESIGNED_PUT_SECONDS,
    })
    return { uploadUrl, expiresInSeconds: PRESIGNED_PUT_SECONDS }
  } catch (error) {
    if (error instanceof R2ConfigurationError) {
      throw error
    }
    throwR2OperationError('presignPut', error)
  }
}

export async function getPresignedResumeGetUrl(storageKey: string): Promise<{
  downloadUrl: string
  expiresInSeconds: number
}> {
  try {
    const client = getS3Client()
    const command = new GetObjectCommand({
      Bucket: bucket(),
      Key: storageKey,
    })
    const downloadUrl = await getSignedUrl(client, command, {
      expiresIn: PRESIGNED_GET_SECONDS,
    })
    return { downloadUrl, expiresInSeconds: PRESIGNED_GET_SECONDS }
  } catch (error) {
    if (error instanceof R2ConfigurationError) {
      throw error
    }
    throwR2OperationError('presignGet', error)
  }
}

export async function headResumeObject(storageKey: string) {
  try {
    const client = getS3Client()
    return await client.send(
      new HeadObjectCommand({
        Bucket: bucket(),
        Key: storageKey,
      }),
    )
  } catch (error) {
    if (error instanceof R2ConfigurationError) {
      throw error
    }
    if (isS3NotFound(error)) {
      return null
    }
    throwR2OperationError('HeadObject', error)
  }
}

export async function deleteResumeObject(storageKey: string): Promise<void> {
  try {
    const client = getS3Client()
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket(),
        Key: storageKey,
      }),
    )
  } catch (error) {
    if (error instanceof R2ConfigurationError) {
      throw error
    }
    throwR2OperationError('DeleteObject', error)
  }
}

function isS3NotFound(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false
  }
  const e = error as {
    name?: string
    Code?: string
    $metadata?: { httpStatusCode?: number }
  }
  if (e.name === 'NotFound' || e.name === 'NoSuchKey') {
    return true
  }
  if (e.Code === 'NoSuchKey' || e.Code === 'NotFound') {
    return true
  }
  return e.$metadata?.httpStatusCode === 404
}

export function etagToChecksum(etag: string | undefined): string {
  if (!etag) {
    return ''
  }
  return etag.replaceAll('"', '')
}

export function contentTypesCompatible(
  expected: string,
  actual: string | undefined,
): boolean {
  if (!actual) {
    return true
  }
  return expected.trim().toLowerCase() === actual.trim().toLowerCase()
}
