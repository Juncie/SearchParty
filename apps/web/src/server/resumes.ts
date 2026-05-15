import { and, desc, eq } from 'drizzle-orm'
import { resumes } from '@searchparty/db'
import {
  resumeFinalizeUploadInputSchema,
  resumeListResponseSchema,
  resumePresignUploadInputSchema,
  resumeRecordSchema,
  sanitizeResumeFileName,
} from '@searchparty/shared'
import { db } from '#/db'
import {
  R2ConfigurationError,
  R2OperationError,
  R2_STORAGE_PROVIDER,
  contentTypesCompatible,
  deleteResumeObject,
  describeR2MissingConfiguration,
  etagToChecksum,
  getPresignedResumeGetUrl,
  getPresignedResumePutUrl,
  headResumeObject,
  isR2Configured,
} from '#/server/storage/r2-object-storage'

function createId() {
  return crypto.randomUUID()
}

function toIsoDate(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

/** Application error with an HTTP status for resume API routes. */
export class ResumeServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ResumeServiceError'
  }
}

function mapR2ClientErrorToResumeService(error: unknown): never {
  if (error instanceof R2ConfigurationError) {
    throw new ResumeServiceError(error.message, 503)
  }
  if (error instanceof R2OperationError) {
    throw new ResumeServiceError(error.message, 502)
  }
  throw error
}

function buildResumeStorageKey(
  userId: string,
  resumeId: string,
  fileName: string | undefined,
): string {
  const safe = sanitizeResumeFileName(fileName)
  return `resumes/users/${userId}/${resumeId}/${safe}`
}

function mapRowToRecord(row: typeof resumes.$inferSelect) {
  return resumeRecordSchema.parse({
    id: row.id,
    kind: row.kind,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    checksum: row.checksum,
    uploadStatus: row.uploadStatus,
    createdAt: toIsoDate(row.createdAt),
    updatedAt: toIsoDate(row.updatedAt),
  })
}

/** Lists resume metadata rows for the given user (newest `updatedAt` first). */
export async function listResumesForUser(userId: string) {
  const rows = await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, userId))
    .orderBy(desc(resumes.updatedAt))

  return resumeListResponseSchema.parse({
    resumes: rows.map(mapRowToRecord),
  })
}

/**
 * Creates a `pending` resume row and returns a presigned PUT URL for direct
 * upload to R2. Caller must send `PATCH` with `{ finalizeUpload: true }` after
 * the PUT succeeds.
 */
export async function createResumePresignedUpload(
  userId: string,
  body: unknown,
) {
  if (!isR2Configured()) {
    throw new ResumeServiceError(describeR2MissingConfiguration(), 503)
  }

  const input = resumePresignUploadInputSchema.parse(body)
  const id = createId()
  const storageKey = buildResumeStorageKey(userId, id, input.fileName)

  await db.insert(resumes).values({
    id,
    kind: input.kind,
    userId,
    storageProvider: R2_STORAGE_PROVIDER,
    storageKey,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    checksum: '',
    uploadStatus: 'pending',
  })

  let uploadUrl: string
  let expiresInSeconds: number
  try {
    const presigned = await getPresignedResumePutUrl({
      storageKey,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
    })
    uploadUrl = presigned.uploadUrl
    expiresInSeconds = presigned.expiresInSeconds
  } catch (error) {
    mapR2ClientErrorToResumeService(error)
  }

  return {
    resumeId: id,
    uploadUrl,
    method: 'PUT' as const,
    headers: {
      'Content-Type': input.mimeType,
    },
    expiresInSeconds,
  }
}

/**
 * Verifies the object exists in R2 (`HeadObject`), then marks the resume `ready`
 * and stores an ETag-derived checksum.
 */
export async function finalizeResumeUpload(userId: string, resumeId: string, body: unknown) {
  if (!isR2Configured()) {
    throw new ResumeServiceError(describeR2MissingConfiguration(), 503)
  }

  resumeFinalizeUploadInputSchema.parse(body)

  const rows = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
    .limit(1)

  if (rows.length === 0) {
    throw new ResumeServiceError('Resume not found.', 404)
  }

  const row = rows[0]

  if (row.uploadStatus !== 'pending') {
    throw new ResumeServiceError('This resume upload is already finalized.', 400)
  }

  let head
  try {
    head = await headResumeObject(row.storageKey)
  } catch (error) {
    mapR2ClientErrorToResumeService(error)
  }
  if (!head) {
    throw new ResumeServiceError(
      'No uploaded file was found for this resume. Upload the file to the presigned URL first.',
      400,
    )
  }

  const contentLength = head.ContentLength
  if (typeof contentLength === 'number' && contentLength !== row.sizeBytes) {
    throw new ResumeServiceError(
      'Uploaded file size does not match the declared size.',
      400,
    )
  }

  if (!contentTypesCompatible(row.mimeType, head.ContentType)) {
    throw new ResumeServiceError(
      'Uploaded file content type does not match the declared MIME type.',
      400,
    )
  }

  const checksum = etagToChecksum(head.ETag)

  await db
    .update(resumes)
    .set({
      uploadStatus: 'ready',
      checksum,
    })
    .where(eq(resumes.id, resumeId))

  const updatedRows = await db
    .select()
    .from(resumes)
    .where(eq(resumes.id, resumeId))
    .limit(1)

  if (updatedRows.length === 0) {
    throw new ResumeServiceError('Resume not found.', 404)
  }

  return mapRowToRecord(updatedRows[0])
}

/** Returns a short-lived presigned GET URL for a `ready` resume. */
export async function getResumeDownloadPayload(userId: string, resumeId: string) {
  if (!isR2Configured()) {
    throw new ResumeServiceError(describeR2MissingConfiguration(), 503)
  }

  const rows = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
    .limit(1)

  if (rows.length === 0) {
    throw new ResumeServiceError('Resume not found.', 404)
  }

  const row = rows[0]

  if (row.uploadStatus !== 'ready') {
    throw new ResumeServiceError(
      'This resume is not ready to download yet. Finish the upload first.',
      400,
    )
  }

  try {
    const { downloadUrl, expiresInSeconds } = await getPresignedResumeGetUrl(
      row.storageKey,
    )
    return { downloadUrl, expiresInSeconds }
  } catch (error) {
    mapR2ClientErrorToResumeService(error)
  }
}

/** Deletes the R2 object and the resume row. Returns whether a row existed. */
export async function deleteResumeForUser(userId: string, resumeId: string) {
  if (!isR2Configured()) {
    throw new ResumeServiceError(describeR2MissingConfiguration(), 503)
  }

  const deleteRows = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
    .limit(1)

  if (deleteRows.length === 0) {
    return false
  }

  const row = deleteRows[0]

  try {
    await deleteResumeObject(row.storageKey)
  } catch (error) {
    mapR2ClientErrorToResumeService(error)
  }
  await db.delete(resumes).where(eq(resumes.id, resumeId))
  return true
}
