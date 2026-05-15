/** Ask the service worker to assign a résumé file in the page MAIN JS world. */
export const extensionMainWorldAssignFileMessageType =
  "searchparty/extension/main-world-assign-file" as const;

export type ExtensionMainWorldAssignFileMessage = {
  type: typeof extensionMainWorldAssignFileMessageType;
  selector: string;
  buffer: ArrayBuffer;
  fileName: string;
  mimeType: string;
};

export type ExtensionMainWorldAssignFileResponse =
  | {
    ok: true;
    result: {
      ok: boolean;
      reason?: string;
      filesLen?: number;
    };
  }
  | { ok: false; error: string };

/**
 * Runs `chrome.scripting.executeScript` in MAIN world (requires background).
 * Falls back to caller when messaging is unavailable (e.g. Vitest).
 */
export async function requestMainWorldResumeFileAssign(
  input: ExtensionMainWorldAssignFileMessage,
): Promise<ExtensionMainWorldAssignFileResponse> {
  if (
    typeof browser === "undefined" ||
    typeof browser.runtime?.sendMessage !== "function"
  ) {
    return {
      ok: false,
      error: "Extension messaging is not available.",
    };
  }
  const raw: unknown = await browser.runtime.sendMessage(input);
  if (
    raw &&
    typeof raw === "object" &&
    "ok" in raw &&
    (raw as ExtensionMainWorldAssignFileResponse).ok === true &&
    "result" in raw
  ) {
    return raw as ExtensionMainWorldAssignFileResponse;
  }
  if (
    raw &&
    typeof raw === "object" &&
    "ok" in raw &&
    (raw as ExtensionMainWorldAssignFileResponse).ok === false &&
    "error" in raw
  ) {
    return raw as ExtensionMainWorldAssignFileResponse;
  }
  return {
    ok: false,
    error: "Unexpected response from the extension background.",
  };
}
