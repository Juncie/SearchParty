import { describe, expect, it } from "vitest";
import {
  formatResumeAttachmentLabel,
  resumeAutofillFileName,
  sanitizeResumeFileName,
} from "./resume-documents";

describe("formatResumeAttachmentLabel", () => {
  it("describes PDF and Word MIME types", () => {
    expect(
      formatResumeAttachmentLabel({
        mimeType: "application/pdf",
      }),
    ).toBe("Uploaded resume (PDF)");
    expect(
      formatResumeAttachmentLabel({
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
    ).toBe("Uploaded resume (Word)");
  });
});

describe("resumeAutofillFileName", () => {
  it("picks a stable extension from MIME type", () => {
    expect(resumeAutofillFileName("application/pdf")).toBe(
      "searchparty-resume.pdf",
    );
    expect(
      resumeAutofillFileName(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ),
    ).toBe("searchparty-resume.docx");
  });
});

describe("sanitizeResumeFileName", () => {
  it("strips directory segments", () => {
    expect(sanitizeResumeFileName("../../etc/passwd")).toBe("passwd");
  });

  it("preserves common safe resume names", () => {
    expect(sanitizeResumeFileName("Jane_Doe-Resume.pdf")).toBe(
      "Jane_Doe-Resume.pdf",
    );
  });

  it("falls back when empty", () => {
    expect(sanitizeResumeFileName("")).toBe("upload");
    expect(sanitizeResumeFileName("___")).toBe("upload");
  });
});
