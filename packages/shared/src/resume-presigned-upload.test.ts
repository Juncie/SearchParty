import { describe, expect, it, vi } from "vitest";

import {
  inferResumeUploadMimeTypeForWizard,
  uploadResumeWithPresignedFlow,
} from "./resume-presigned-upload";

describe("inferResumeUploadMimeTypeForWizard", () => {
  it("accepts browser MIME when allowed", () => {
    expect(
      inferResumeUploadMimeTypeForWizard({
        name: "cv.bin",
        mimeTypeFromBrowser: "application/pdf",
      }),
    ).toBe("application/pdf");
  });

  it("falls back from file extension when type is empty", () => {
    expect(
      inferResumeUploadMimeTypeForWizard({
        name: "Resume.DOCX",
        mimeTypeFromBrowser: "",
      }),
    ).toBe(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
  });

  it("returns null for unsupported types", () => {
    expect(
      inferResumeUploadMimeTypeForWizard({
        name: "notes.txt",
        mimeTypeFromBrowser: "text/plain",
      }),
    ).toBeNull();
  });
});

describe("uploadResumeWithPresignedFlow", () => {
  it("presigns, uploads bytes, then finalizes", async () => {
    const requestPresign = vi.fn().mockResolvedValue({
      resumeId: "rid",
      uploadUrl: "https://example.test/put",
      method: "PUT",
      headers: { "Content-Type": "application/pdf" },
      expiresInSeconds: 60,
    });
    const putStorage = vi.fn().mockResolvedValue(undefined);
    const requestFinalize = vi.fn().mockResolvedValue({
      resume: {
        id: "rid",
        kind: "resume",
        mimeType: "application/pdf",
        sizeBytes: 12,
        checksum: "abc",
        uploadStatus: "ready",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    const blob = new Blob([new Uint8Array(12)], { type: "application/pdf" });
    const out = await uploadResumeWithPresignedFlow({
      blob,
      sizeBytes: 12,
      fileName: "cv.pdf",
      mimeType: "application/pdf",
      http: { requestPresign, putStorage, requestFinalize },
    });

    expect(out.id).toBe("rid");
    expect(requestPresign).toHaveBeenCalledTimes(1);
    expect(putStorage).toHaveBeenCalledTimes(1);
    expect(requestFinalize).toHaveBeenCalledWith("rid");
  });
});
