import type {
  AutofillExecutionOptions,
  AutofillFieldExecutionResult,
  ExtensionAutofillFill,
} from "@searchparty/shared";
import {
  normalizeSignalValue,
  RESUME_AUTOFILL_MAX_BYTES,
} from "@searchparty/shared";

import { agentDebugLog } from "../agent-debug-log";
import { fetchBlobViaExtension } from "../extension-fetch-blob";
import {
  extensionMainWorldAssignFileMessageType,
  requestMainWorldResumeFileAssign,
} from "../extension-main-world-assign";

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && "escape" in CSS) {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, "");
}

function isFillableElement(
  el: Element,
): el is
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement {
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement
  );
}

function isVisible(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el);
  return (
    style.visibility !== "hidden" &&
    style.display !== "none" &&
    !el.hidden
  );
}

function dispatchFillEvents(el: HTMLElement): void {
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
  el.dispatchEvent(new Event("blur", { bubbles: true }));
}

function setElementValue(
  el: HTMLInputElement | HTMLTextAreaElement,
  value: string,
): void {
  const prototype =
    el instanceof HTMLInputElement
      ? HTMLInputElement.prototype
      : HTMLTextAreaElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(
    prototype,
    "value",
  )?.set;
  if (setter) {
    setter.call(el, value);
    return;
  }
  el.value = value;
}

function normalizeOptionValue(value: string): string {
  return normalizeSignalValue(value);
}

function selectNativeOption(
  el: HTMLSelectElement,
  rawValue: string,
): boolean {
  const target = normalizeOptionValue(rawValue);
  if (!target) {
    return false;
  }

  const options = Array.from(el.options);
  const exact = options.find((option) => {
    const label = normalizeOptionValue(
      option.label || option.textContent || "",
    );
    const value = normalizeOptionValue(option.value);
    return label === target || value === target;
  });
  const fuzzy =
    exact ??
    options.find((option) => {
      const label = normalizeOptionValue(
        option.label || option.textContent || "",
      );
      const value = normalizeOptionValue(option.value);
      return (
        (label.length > 0 &&
          (label.includes(target) || target.includes(label))) ||
        (value.length > 0 &&
          (value.includes(target) || target.includes(value)))
      );
    });

  if (!fuzzy) {
    return false;
  }

  el.value = fuzzy.value;
  return el.value === fuzzy.value;
}

function booleanFromValue(value: string): boolean | null {
  const normalized = normalizeSignalValue(value);
  if (["true", "yes", "y", "1", "checked", "on"].includes(normalized)) {
    return true;
  }
  if (["false", "no", "n", "0", "unchecked", "off"].includes(normalized)) {
    return false;
  }
  return null;
}

function resumeAutofillTooLargeReason(): string {
  return `Resume is larger than ${String(Math.floor(RESUME_AUTOFILL_MAX_BYTES / (1024 * 1024)))}MB; shrink the file or skip file autofill.`;
}

async function resumeBlobFromFetchResponse(
  res: Response,
): Promise<{ ok: true; blob: Blob } | { ok: false; reason: string }> {
  const lenHeader = res.headers.get("content-length");
  if (lenHeader) {
    const n = Number(lenHeader);
    if (Number.isFinite(n) && n > RESUME_AUTOFILL_MAX_BYTES) {
      return { ok: false, reason: resumeAutofillTooLargeReason() };
    }
  }
  const blob = await res.blob();
  if (blob.size > RESUME_AUTOFILL_MAX_BYTES) {
    return { ok: false, reason: resumeAutofillTooLargeReason() };
  }
  return { ok: true, blob };
}

function safeResumeDownloadHost(fileUrl: string): string {
  try {
    return new URL(fileUrl).hostname;
  } catch {
    return "(invalid-url)";
  }
}

function assignFileToInputIsolated(
  el: HTMLInputElement,
  file: File,
): { ok: boolean; reason?: string } {
  const dt = new DataTransfer();
  dt.items.add(file);
  el.files = dt.files;
  dispatchFillEvents(el);
  const ok = el.files?.length === 1;
  // #region agent log
  agentDebugLog({
    hypothesisId: "H-resume-assign",
    location: "executeAutofill.ts:assignFileToInputIsolated",
    message: "After DataTransfer assign (isolated world)",
    data: {
      filesLength: el.files?.length ?? 0,
      inputType: el.type,
      ok,
    },
  });
  // #endregion
  return ok
    ? { ok: true }
    : {
      ok: false,
      reason: "The file input did not accept the attachment.",
    };
}

async function assignFileToInput(
  el: HTMLInputElement,
  file: File,
): Promise<{ ok: boolean; reason?: string }> {
  const spId = el.getAttribute("data-searchparty-autofill-id") ?? "";
  const selector = `[data-searchparty-autofill-id="${cssEscape(spId)}"]`;
  const buffer = await file.arrayBuffer();
  const mimeType = file.type || "application/pdf";

  const mw = await requestMainWorldResumeFileAssign({
    type: extensionMainWorldAssignFileMessageType,
    selector,
    buffer,
    fileName: file.name,
    mimeType,
  });

  // #region agent log
  agentDebugLog({
    hypothesisId: "H-assign-strategy",
    location: "executeAutofill.ts:assignFileToInput",
    message: "MAIN-world assign response",
    data: {
      bridgeOk: mw.ok,
      mainOk:
        mw.ok && "result" in mw ? mw.result.ok : null,
    },
  });
  // #endregion

  if (mw.ok && "result" in mw && mw.result.ok) {
    return { ok: true };
  }

  return assignFileToInputIsolated(el, file);
}

async function loadBlobForResumeDownload(
  fileUrl: string,
  host: string,
): Promise<{ ok: true; blob: Blob } | { ok: false; reason: string }> {
  const isHttp = /^https?:\/\//i.test(fileUrl);

  if (isHttp) {
    const bg = await fetchBlobViaExtension(fileUrl);
    if (bg.ok) {
      // #region agent log
      agentDebugLog({
        hypothesisId: "H-resume-via-bg",
        location:
          "executeAutofill.ts:loadBlobForResumeDownload",
        message: "Résumé bytes loaded via background fetch",
        data: {
          host,
          bytes: bg.buffer.byteLength,
          contentType: bg.contentType,
        },
      });
      // #endregion
      return {
        ok: true,
        blob: new Blob([bg.buffer], { type: bg.contentType }),
      };
    }

    const allowContentFetch =
      bg.error === "Extension messaging is not available." ||
      /Could not establish connection|Receiving end does not exist/i.test(
        bg.error,
      );

    if (!allowContentFetch) {
      // #region agent log
      agentDebugLog({
        hypothesisId: "H-resume-bg-fail",
        location:
          "executeAutofill.ts:loadBlobForResumeDownload",
        message: "Background blob fetch failed (no content fallback)",
        data: { host, err: bg.error },
      });
      // #endregion
      return {
        ok: false,
        reason: `Could not download your résumé (${bg.error}). Try Apply again.`,
      };
    }
  }

  let res: Response;
  try {
    res = await fetch(fileUrl);
  } catch (fetchErr: unknown) {
    const msg =
      fetchErr instanceof Error
        ? fetchErr.message
        : String(fetchErr);
    // #region agent log
    agentDebugLog({
      hypothesisId: "H-resume-fetch",
      location:
        "executeAutofill.ts:loadBlobForResumeDownload:fetch",
      message: "content fetch() threw",
      data: { host, msg },
    });
    // #endregion
    return {
      ok: false,
      reason: `Could not download your résumé (${msg}). Check the network, disable blockers for this site, or try Apply again.`,
    };
  }

  // #region agent log
  agentDebugLog({
    hypothesisId: "H-resume-http",
    location:
      "executeAutofill.ts:loadBlobForResumeDownload:response",
    message: "content fetch() completed",
    data: {
      host,
      status: res.status,
      ok: res.ok,
      ct: res.headers.get("content-type")?.split(";")[0]?.trim() ?? null,
    },
  });
  // #endregion

  if (!res.ok) {
    const expired = res.status === 403 || res.status === 404;
    return {
      ok: false,
      reason: expired
        ? "Download link expired or is no longer valid. Try Apply again."
        : `Could not download the résumé (HTTP ${String(res.status)}). Try Apply again.`,
    };
  }

  let blobResult: Awaited<
    ReturnType<typeof resumeBlobFromFetchResponse>
  >;
  try {
    blobResult = await resumeBlobFromFetchResponse(res);
  } catch (blobErr: unknown) {
    const msg =
      blobErr instanceof Error
        ? blobErr.message
        : String(blobErr);
    // #region agent log
    agentDebugLog({
      hypothesisId: "H-resume-blob",
      location:
        "executeAutofill.ts:loadBlobForResumeDownload:blob",
      message: "Reading response body failed",
      data: { host, msg },
    });
    // #endregion
    return {
      ok: false,
      reason: `Could not read the résumé download (${msg}). Try Apply again.`,
    };
  }

  if (!blobResult.ok) {
    return { ok: false, reason: blobResult.reason };
  }
  return { ok: true, blob: blobResult.blob };
}

async function applyFileInputFromRemoteUrl(
  el: HTMLInputElement,
  fileUrl: string,
  fileName: string,
): Promise<{ ok: boolean; reason?: string }> {
  const host = safeResumeDownloadHost(fileUrl);
  try {
    const loaded = await loadBlobForResumeDownload(fileUrl, host);
    if (!loaded.ok) {
      return { ok: false, reason: loaded.reason };
    }
    const file = new File([loaded.blob], fileName, {
      type: loaded.blob.type || "application/pdf",
    });
    return await assignFileToInput(el, file);
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : String(error);
    // #region agent log
    agentDebugLog({
      hypothesisId: "H-resume-unexpected",
      location:
        "executeAutofill.ts:applyFileInputFromRemoteUrl:catch",
      message: "Unexpected error in applyFileInputFromRemoteUrl",
      data: { host, msg },
    });
    // #endregion
    return {
      ok: false,
      reason: `Could not attach the résumé (${msg}). Custom ATS uploaders sometimes block programmatic file assignment — attach the file manually if this persists.`,
    };
  }
}

async function applyFileInputFromDataUrl(
  el: HTMLInputElement,
  fileDataUrl: string,
  fileName: string,
): Promise<{ ok: boolean; reason?: string }> {
  try {
    let res: Response;
    try {
      res = await fetch(fileDataUrl);
    } catch (fetchErr: unknown) {
      const msg =
        fetchErr instanceof Error
          ? fetchErr.message
          : String(fetchErr);
      agentDebugLog({
        hypothesisId: "H-resume-data-fetch",
        location:
          "executeAutofill.ts:applyFileInputFromDataUrl:fetch",
        message: "fetch(data:) threw",
        data: { msg },
      });
      return {
        ok: false,
        reason: `Could not decode the résumé attachment (${msg}).`,
      };
    }
    if (!res.ok) {
      return {
        ok: false,
        reason: "Could not decode the resume attachment.",
      };
    }
    const blobResult = await resumeBlobFromFetchResponse(res);
    if (!blobResult.ok) {
      return { ok: false, reason: blobResult.reason };
    }
    const file = new File([blobResult.blob], fileName, {
      type: blobResult.blob.type || "application/octet-stream",
    });
    return await assignFileToInput(el, file);
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : String(error);
    agentDebugLog({
      hypothesisId: "H-resume-data-catch",
      location:
        "executeAutofill.ts:applyFileInputFromDataUrl:catch",
      message: "Unexpected error in applyFileInputFromDataUrl",
      data: { msg },
    });
    return {
      ok: false,
      reason: `Could not attach the résumé (${msg}).`,
    };
  }
}

async function executeFieldInteraction(
  el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  fill: ExtensionAutofillFill,
): Promise<{ ok: boolean; reason?: string }> {
  if (el instanceof HTMLSelectElement) {
    if (!selectNativeOption(el, fill.value)) {
      return {
        ok: false,
        reason: "No matching select option was found.",
      };
    }
    dispatchFillEvents(el);
    return { ok: true };
  }

  if (
    el instanceof HTMLInputElement &&
    el.type === "checkbox"
  ) {
    const checked = booleanFromValue(fill.value);
    if (checked === null) {
      return {
        ok: false,
        reason: "Checkbox fill value was not a boolean choice.",
      };
    }
    if (el.checked !== checked) {
      el.checked = checked;
      dispatchFillEvents(el);
    }
    return el.checked === checked
      ? { ok: true }
      : {
        ok: false,
        reason: "Checkbox state did not update.",
      };
  }

  if (el instanceof HTMLInputElement && el.type === "radio") {
    return {
      ok: false,
      reason: "radio inputs are detected but not filled yet.",
    };
  }

  if (el instanceof HTMLInputElement && el.type === "file") {
    const downloadUrl = fill.fileDownloadUrl?.trim();
    if (downloadUrl) {
      return applyFileInputFromRemoteUrl(
        el,
        downloadUrl,
        fill.fileName ?? "searchparty-resume.pdf",
      );
    }
    const dataUrl = fill.fileDataUrl?.trim();
    if (!dataUrl) {
      return {
        ok: false,
        reason: "No resume file payload was provided for this file field.",
      };
    }
    return applyFileInputFromDataUrl(
      el,
      dataUrl,
      fill.fileName ?? "searchparty-resume.pdf",
    );
  }

  setElementValue(el, fill.value);
  dispatchFillEvents(el);
  return el.value === fill.value
    ? { ok: true }
    : { ok: false, reason: "Text value did not update." };
}

/**
 * Applies autofill values to previously tagged controls. File fills resolve a
 * presigned URL in the content script (preferred) or decode a `data:` URL.
 */
export async function executeAutofill(
  fills: ExtensionAutofillFill[],
  options: AutofillExecutionOptions = {},
): Promise<{
  appliedSpIds: string[];
  results: AutofillFieldExecutionResult[];
}> {
  const appliedSpIds: string[] = [];
  const results: AutofillFieldExecutionResult[] = [];
  const requireVisible = options.requireVisible ?? true;

  for (const fill of fills) {
    const el = document.querySelector(
      `[data-searchparty-autofill-id="${cssEscape(fill.spId)}"]`,
    );
    if (!el || !isFillableElement(el)) {
      results.push({
        spId: fill.spId,
        ok: false,
        reason: "Tagged field was not found or is unsupported.",
      });
      continue;
    }
    const isFileInput =
      el instanceof HTMLInputElement && el.type === "file";
    // Many ATS pages keep the real <input type="file"> visually hidden (sr-only,
    // display:none, etc.) behind branded buttons — it is still fillable.
    if (requireVisible && !isFileInput && !isVisible(el)) {
      // #region agent log
      const htmlEl = el as HTMLElement;
      const cs = window.getComputedStyle(htmlEl);
      const snap = {
        spId: fill.spId,
        tag: htmlEl.tagName,
        id: htmlEl.id || null,
        name:
          htmlEl instanceof HTMLInputElement ||
            htmlEl instanceof HTMLTextAreaElement ||
            htmlEl instanceof HTMLSelectElement
            ? htmlEl.getAttribute("name")
            : null,
        inputType:
          htmlEl instanceof HTMLInputElement ? htmlEl.type : null,
        isFileInput,
        requireVisible,
        hasFileDownloadUrl: Boolean(fill.fileDownloadUrl?.trim()),
        hasFileDataUrl: Boolean(fill.fileDataUrl?.trim()),
        valueLen: el.value?.length ?? 0,
        display: cs.display,
        visibility: cs.visibility,
        opacity: cs.opacity,
        ariaHidden: htmlEl.getAttribute("aria-hidden"),
        hiddenAttr: htmlEl.hidden,
      };
      agentDebugLog({
        hypothesisId: "H1-H4",
        location: "executeAutofill.ts:visibilityGate",
        message: "Blocked apply: requireVisible && !file && !isVisible",
        data: snap,
      });
      console.warn(
        "[SearchParty-debug] autofill visibility gate",
        snap,
      );
      // #endregion
      results.push({
        spId: fill.spId,
        ok: false,
        reason: "Field is not visible.",
      });
      continue;
    }
    if (
      !(el instanceof HTMLInputElement && el.type === "checkbox") &&
      !isFileInput &&
      !options.overwriteExisting &&
      el.value.trim().length > 0
    ) {
      results.push({
        spId: fill.spId,
        ok: false,
        reason: "Field already has a value.",
      });
      continue;
    }
    if (options.dryRun) {
      appliedSpIds.push(fill.spId);
      results.push({ spId: fill.spId, ok: true });
      continue;
    }

    el.focus();
    const result = await executeFieldInteraction(el, fill);
    results.push({ spId: fill.spId, ...result });
    if (result.ok) {
      appliedSpIds.push(fill.spId);
    }
  }

  return { appliedSpIds, results };
}
