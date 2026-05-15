import { z } from "zod";

/** Upper bound for a single resume-side upload (bytes). */
export const RESUME_UPLOAD_MAX_BYTES = 15 * 1024 * 1024;

/**
 * Max resume size the extension will fetch into memory when attaching to a file
 * input (content-script fetch from a presigned URL or decoding a `data:` URL).
 */
export const RESUME_AUTOFILL_MAX_BYTES = 8 * 1024 * 1024;

/** Short label for UI when a ready resume is available for autofill. */
export function formatResumeAttachmentLabel(input: {
  mimeType: string;
}): string {
  const mime = input.mimeType.toLowerCase();
  if (mime.includes("pdf")) {
    return "Uploaded resume (PDF)";
  }
  if (
    mime.includes("wordprocessingml") ||
    mime === "application/msword"
  ) {
    return "Uploaded resume (Word)";
  }
  return "Uploaded resume";
}

/** Filename used when assigning a {@link File} to a file input. */
export function resumeAutofillFileName(mimeType: string): string {
  const mime = mimeType.toLowerCase();
  if (mime.includes("pdf")) {
    return "searchparty-resume.pdf";
  }
  if (mime.includes("wordprocessingml")) {
    return "searchparty-resume.docx";
  }
  if (mime === "application/msword") {
    return "searchparty-resume.doc";
  }
  return "searchparty-resume";
}

export const resumeDocumentKindSchema = z.enum([
  "resume",
  "cover_letter",
  "portfolio",
  "other",
]);

export const resumeUploadMimeTypeSchema = z.enum([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const resumePresignUploadInputSchema = z.object({
  kind: resumeDocumentKindSchema,
  mimeType: resumeUploadMimeTypeSchema,
  sizeBytes: z
    .number()
    .int()
    .positive()
    .max(RESUME_UPLOAD_MAX_BYTES),
  fileName: z.string().trim().min(1).max(200).optional(),
});

export const resumeFinalizeUploadInputSchema = z.object({
  finalizeUpload: z.literal(true),
});

export const resumeUploadStatusSchema = z.enum(["pending", "ready"]);

export const resumeRecordSchema = z.object({
  id: z.string(),
  kind: resumeDocumentKindSchema,
  mimeType: z.string(),
  sizeBytes: z.number().int(),
  checksum: z.string(),
  uploadStatus: resumeUploadStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ResumeDocumentKind = z.infer<typeof resumeDocumentKindSchema>;
export type ResumeRecord = z.infer<typeof resumeRecordSchema>;

/** JSON body from `PATCH /api/resumes/:resumeId` after `{ finalizeUpload: true }`. */
export const resumeFinalizeUploadResponseSchema = z.object({
  resume: resumeRecordSchema,
});

export type ResumeFinalizeUploadResponse = z.infer<
  typeof resumeFinalizeUploadResponseSchema
>;

export const resumeDownloadResponseSchema = z.object({
  downloadUrl: z.string().url(),
  expiresInSeconds: z.number().int(),
});

export type ResumeDownloadResponse = z.infer<typeof resumeDownloadResponseSchema>;

export const resumePresignUploadResponseSchema = z.object({
  resumeId: z.string(),
  uploadUrl: z.string().url(),
  method: z.literal("PUT"),
  headers: z.object({
    "Content-Type": z.string(),
  }),
  expiresInSeconds: z.number().int(),
});

export type ResumePresignUploadResponse = z.infer<
  typeof resumePresignUploadResponseSchema
>;

export const resumeListResponseSchema = z.object({
  resumes: z.array(resumeRecordSchema),
});

export type ResumeListResponse = z.infer<typeof resumeListResponseSchema>;

export type ResumePresignUploadInput = z.infer<
  typeof resumePresignUploadInputSchema
>;

/**
 * Produces a single path segment safe for R2 object keys. Falls back to
 * `"upload"` when the input is empty after sanitization.
 */
export function sanitizeResumeFileName(input: string | undefined): string {
  const raw = (input ?? "upload").trim().slice(0, 200);
  const stripped = raw.replace(/^.*[\\/]/, "");
  const safe = stripped
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return safe.length > 0 ? safe : "upload";
}
