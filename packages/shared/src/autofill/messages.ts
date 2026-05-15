import type {
  AutofillExecutionOptions,
  AutofillFieldExecutionResult,
} from "./types";

/** Runtime message `type` for reading the cached autofill scan from a tab. */
export const extensionAutofillGetScanMessageType =
  "searchparty/extension/autofill/get-scan" as const;

/** Runtime message `type` for forcing a fresh autofill scan in a tab. */
export const extensionAutofillScanMessageType =
  "searchparty/extension/autofill/scan" as const;

/** Runtime message `type` for applying fill payloads to tagged controls in a tab. */
export const extensionAutofillApplyMessageType =
  "searchparty/extension/autofill/apply" as const;

/** Single fill request sent from the extension panel to the content script. */
export type ExtensionAutofillFill = {
  spId: string;
  value: string;
  /**
   * Presigned HTTPS URL to fetch as a {@link Blob} in the content script, then
   * assign to `<input type="file">` via
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer | DataTransfer}.
   *
   * Prefer this over {@link ExtensionAutofillFill.fileDataUrl} — small IPC payload.
   * When both are set, the apply step prefers `fileDownloadUrl`.
   */
  fileDownloadUrl?: string;
  /**
   * When set with a `data:` URL (and no preferred `fileDownloadUrl`), applied to
   * `<input type="file">` via DataTransfer. Intended for tests or narrow debugging.
   */
  fileDataUrl?: string;
  /** Suggested file name for the synthetic {@link File}. */
  fileName?: string;
};

/** Apply message payload accepted by the content script. */
export type ExtensionAutofillApplyMessage = {
  type: typeof extensionAutofillApplyMessageType;
  fills: ExtensionAutofillFill[];
  options?: AutofillExecutionOptions;
};

/** Apply response returned by the content script after verification. */
export type ExtensionAutofillApplyResponse =
  | {
    ok: true;
    appliedSpIds: string[];
    results: AutofillFieldExecutionResult[];
  }
  | { ok: false; error: string };
