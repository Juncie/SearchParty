import {
  extensionAutofillApplyMessageType,
  extensionAutofillGetScanMessageType,
  extensionAutofillScanMessageType,
  type AutofillExecutionOptions,
  type ExtensionAutofillApplyResponse,
  type ExtensionAutofillFill,
  type ScannedAutofillFieldPayload,
} from "@searchparty/shared";

export type ActiveTabScanResponse =
  | { ok: true; fields: ScannedAutofillFieldPayload[] }
  | { ok: false; error: string };

export async function getExtensionActiveTabId(): Promise<
  number | undefined
> {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tabs[0]?.id;
}

export async function scanActiveTab(
  mode: "cached" | "refresh"
): Promise<ActiveTabScanResponse> {
  try {
    const tabId = await getExtensionActiveTabId();
    if (tabId === undefined) {
      return {
        ok: false,
        error: "No active tab found in this window.",
      };
    }
    const messageType =
      mode === "refresh"
        ? extensionAutofillScanMessageType
        : extensionAutofillGetScanMessageType;
    const raw: unknown = await browser.tabs.sendMessage(
      tabId,
      {
        type: messageType,
      }
    );
    const res = raw as ActiveTabScanResponse;
    if (!res || typeof res !== "object" || !("ok" in res)) {
      return {
        ok: false,
        error: "Unexpected scan response.",
      };
    }
    return res;
  } catch {
    return {
      ok: false,
      error:
        "Could not reach this page. Open a normal http(s) tab with the form, keep it active in this browser window, and try again.",
    };
  }
}

export async function applyAutofillToActiveTab(
  fills: ExtensionAutofillFill[],
  options?: AutofillExecutionOptions
): Promise<ExtensionAutofillApplyResponse> {
  try {
    const tabId = await getExtensionActiveTabId();
    if (tabId === undefined) {
      return {
        ok: false,
        error: "No active tab found in this window.",
      };
    }
    const raw: unknown = await browser.tabs.sendMessage(
      tabId,
      {
        type: extensionAutofillApplyMessageType,
        fills,
        options,
      }
    );
    const res = raw as ExtensionAutofillApplyResponse;
    if (!res?.ok) {
      return {
        ok: false,
        error: res?.error ?? "Apply failed.",
      };
    }
    return res;
  } catch {
    return {
      ok: false,
      error:
        "Could not apply fills. Refresh the scan if you navigated to another page.",
    };
  }
}
