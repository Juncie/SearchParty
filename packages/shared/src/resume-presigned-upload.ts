import {
  RESUME_UPLOAD_MAX_BYTES,
  resumeFinalizeUploadResponseSchema,
  resumePresignUploadInputSchema,
  resumePresignUploadResponseSchema,
  resumeUploadMimeTypeSchema,
  sanitizeResumeFileName,
  type ResumeDocumentKind,
  type ResumePresignUploadInput,
  type ResumeRecord,
} from "./resume-documents";

/**
 * Maps a browser file picker result to an allowed résumé MIME type, using
 * `File.type` when valid and falling back to the file name extension.
 */
export function inferResumeUploadMimeTypeForWizard(input: {
  name: string;
  mimeTypeFromBrowser: string;
}): ResumePresignUploadInput["mimeType"] | null {
  const trimmed = input.mimeTypeFromBrowser?.trim() ?? "";
  const direct = resumeUploadMimeTypeSchema.safeParse(trimmed);
  if (direct.success) {
    return direct.data;
  }
  const lower = input.name.toLowerCase();
  if (lower.endsWith(".pdf")) {
    return "application/pdf";
  }
  if (lower.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (lower.endsWith(".doc")) {
    return "application/msword";
  }
  return null;
}

export interface ResumePresignedUploadHttp {
  requestPresign: (body: ResumePresignUploadInput) => Promise<unknown>;
  putStorage: (input: {
    url: string;
    method: "PUT";
    headers: Record<string, string>;
    body: Blob;
  }) => Promise<void>;
  requestFinalize: (resumeId: string) => Promise<unknown>;
}

/**
 * Runs SearchParty résumé storage: presign → PUT bytes to object storage →
 * finalize. Callers supply HTTP adapters (extension vs web fetch/cookies).
 */
export async function uploadResumeWithPresignedFlow(input: {
  blob: Blob;
  sizeBytes: number;
  fileName: string;
  mimeType: ResumePresignUploadInput["mimeType"];
  kind?: ResumeDocumentKind;
  http: ResumePresignedUploadHttp;
}): Promise<ResumeRecord> {
  if (input.sizeBytes <= 0) {
    throw new Error("Choose a non-empty file.");
  }
  if (input.sizeBytes > RESUME_UPLOAD_MAX_BYTES) {
    throw new Error(
      `Résumé must be ${String(Math.floor(RESUME_UPLOAD_MAX_BYTES / (1024 * 1024)))}MB or smaller.`,
    );
  }

  const safeName = sanitizeResumeFileName(input.fileName);

  const presignBody = resumePresignUploadInputSchema.parse({
    kind: input.kind ?? "resume",
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    fileName: safeName,
  });

  const presign = resumePresignUploadResponseSchema.parse(
    await input.http.requestPresign(presignBody),
  );

  const headerRecord: Record<string, string> = {};
  for (const [key, val] of Object.entries(presign.headers)) {
    headerRecord[key] = String(val);
  }

  await input.http.putStorage({
    url: presign.uploadUrl,
    method: presign.method,
    headers: headerRecord,
    body: input.blob,
  });

  const finalized = resumeFinalizeUploadResponseSchema.parse(
    await input.http.requestFinalize(presign.resumeId),
  );

  return finalized.resume;
}
