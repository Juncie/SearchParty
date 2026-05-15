import {
  inferResumeUploadMimeTypeForWizard,
  RESUME_UPLOAD_MAX_BYTES,
  uploadResumeWithPresignedFlow,
} from '@searchparty/shared'

async function readJsonOrThrow(res: Response): Promise<unknown> {
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string
    } | null
    throw new Error(
      typeof body?.message === 'string'
        ? body.message
        : `Request failed (${String(res.status)}).`,
    )
  }
  return res.json()
}

export type WizardResumeUploadAnswer = {
  fileName: string
  fileSize: number
  mimeType: string
  resumeId: string
  uploadStatus: 'ready'
}

/**
 * Uploads a wizard-selected résumé through SearchParty presigned storage so the
 * account has a `ready` row for file autofill.
 */
export async function uploadResumeFromWizardFile(
  file: File,
): Promise<WizardResumeUploadAnswer> {
  const mimeType = inferResumeUploadMimeTypeForWizard({
    name: file.name,
    mimeTypeFromBrowser: file.type,
  })
  if (!mimeType) {
    throw new Error(
      'Only PDF, .doc, and .docx files are supported for résumé upload.',
    )
  }
  if (file.size > RESUME_UPLOAD_MAX_BYTES) {
    throw new Error(
      `Résumé must be ${String(Math.floor(RESUME_UPLOAD_MAX_BYTES / (1024 * 1024)))}MB or smaller.`,
    )
  }

  const record = await uploadResumeWithPresignedFlow({
    blob: file,
    sizeBytes: file.size,
    fileName: file.name,
    mimeType,
    kind: 'resume',
    http: {
      requestPresign: async (body) => {
        const res = await fetch('/api/resumes/', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        return readJsonOrThrow(res)
      },
      putStorage: async ({ url, method, headers, body }) => {
        const h = new Headers()
        for (const [key, value] of Object.entries(headers)) {
          h.set(key, value)
        }
        const res = await fetch(url, {
          method,
          headers: h,
          body,
          mode: 'cors',
          credentials: 'omit',
        })
        if (!res.ok) {
          throw new Error(
            `Could not upload file to storage (${String(res.status)}). Try again.`,
          )
        }
      },
      requestFinalize: async (resumeId) => {
        const res = await fetch(`/api/resumes/${resumeId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ finalizeUpload: true }),
        })
        return readJsonOrThrow(res)
      },
    },
  })

  return {
    fileName: file.name,
    fileSize: file.size,
    mimeType,
    resumeId: record.id,
    uploadStatus: 'ready',
  }
}
