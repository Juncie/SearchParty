import {
  extensionAutofillApplyMessageType,
  extensionAutofillGetScanMessageType,
  extensionAutofillScanMessageType,
  type AutofillExecutionOptions,
  type ExtensionAutofillApplyResponse,
  type ExtensionAutofillFill,
  type ScannedAutofillFieldPayload,
} from "@searchparty/shared";

import { agentDebugLog } from "./agent-debug-log";

export type ActiveTabScanResponse =
  | { ok: true; fields: ScannedAutofillFieldPayload[] }
  | { ok: false; error: string };

/** Active tab in the window that hosts this extension UI (e.g. side panel). */
export async function getExtensionActiveTabId(): Promise<
  number | undefined
> {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tabs[0]?.id;
}

/**
 * Active tab in the last-focused browser window (often the page the user was
 * just interacting with). Helps when the side panel steals "current window"
 * semantics in some Chrome builds.
 */
async function getLastFocusedActiveTabId(): Promise<
  number | undefined
> {
  const tabs = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  return tabs[0]?.id;
}

export async function scanActiveTab(
  mode: "cached" | "refresh"
): Promise<ActiveTabScanResponse> {
  try {
    const tabCurrent = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tabLastFocused = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const currentId = tabCurrent[0]?.id;
    const lastFocusedId = tabLastFocused[0]?.id;
    const currentUrl = tabCurrent[0]?.url ?? null;
    const lastFocusedUrl = tabLastFocused[0]?.url ?? null;

    let tabId = currentId;
    if (tabId === undefined) {
      tabId = lastFocusedId;
    }

    // #region agent log
    agentDebugLog({
      hypothesisId: "H-scan-tab",
      location: "autofill-active-tab.ts:scanActiveTab:pickTab",
      message: "Resolved active tab candidates before sendMessage",
      data: {
        mode,
        currentId,
        lastFocusedId,
        currentUrlKind: currentUrl?.split(":")[0] ?? null,
        lastFocusedUrlKind: lastFocusedUrl?.split(":")[0] ?? null,
        pickedTabId: tabId,
        sameTab: currentId === lastFocusedId,
      },
    });
    // #endregion

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

    const sendToTab = async (id: number) =>
      browser.tabs.sendMessage(id, {
        type: messageType,
      });

    let raw: unknown;
    try {
      raw = await sendToTab(tabId);
    } catch (firstError: unknown) {
      const errMsg =
        firstError instanceof Error
          ? firstError.message
          : String(firstError);

      // #region agent log
      agentDebugLog({
        hypothesisId: "H-sendMessage",
        location: "autofill-active-tab.ts:scanActiveTab:sendMessage",
        message: "sendMessage failed on primary tab",
        data: {
          tabId,
          errMsg,
          willRetryLastFocused:
            lastFocusedId !== undefined &&
            lastFocusedId !== tabId,
        },
      });
      // #endregion

      if (
        lastFocusedId !== undefined &&
        lastFocusedId !== tabId
      ) {
        try {
          raw = await sendToTab(lastFocusedId);
          tabId = lastFocusedId;
        } catch (secondError: unknown) {
          const err2 =
            secondError instanceof Error
              ? secondError.message
              : String(secondError);
          agentDebugLog({
            hypothesisId: "H-sendMessage-retry",
            location:
              "autofill-active-tab.ts:scanActiveTab:sendMessageRetry",
            message: "sendMessage failed on lastFocused tab too",
            data: { tabId: lastFocusedId, errMsg: err2 },
          });
          throw secondError;
        }
      } else {
        throw firstError;
      }
    }

    const res = raw as ActiveTabScanResponse;
    if (!res || typeof res !== "object" || !("ok" in res)) {
      return {
        ok: false,
        error: "Unexpected scan response.",
      };
    }
    return res;
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : String(error);
    const hint =
      /Receiving end does not exist|Could not establish connection/i.test(
        errMsg,
      )
        ? " Reload the job page (or restart the browser) after updating the extension."
        : "";
    // #region agent log
    agentDebugLog({
      hypothesisId: "H-scan-catch",
      location: "autofill-active-tab.ts:scanActiveTab:catch",
      message: "scanActiveTab outer catch",
      data: { errMsg },
    });
    // #endregion
    return {
      ok: false,
      error: `Could not reach this page.${hint} (${errMsg})`,
    };
  }
}

export async function applyAutofillToActiveTab(
  fills: ExtensionAutofillFill[],
  options?: AutofillExecutionOptions
): Promise<ExtensionAutofillApplyResponse> {
  try {
    let tabId = await getExtensionActiveTabId();
    if (tabId === undefined) {
      tabId = await getLastFocusedActiveTabId();
    }
    if (tabId === undefined) {
      return {
        ok: false,
        error: "No active tab found in this window.",
      };
    }
    const payload = {
      type: extensionAutofillApplyMessageType,
      fills,
      options,
    };

    let raw: unknown;
    try {
      raw = await browser.tabs.sendMessage(tabId, payload);
    } catch (firstError: unknown) {
      const lastId = await getLastFocusedActiveTabId();
      if (lastId !== undefined && lastId !== tabId) {
        raw = await browser.tabs.sendMessage(lastId, payload);
      } else {
        throw firstError;
      }
    }
    const res = raw as ExtensionAutofillApplyResponse;
    if (!res?.ok) {
      return {
        ok: false,
        error: res?.error ?? "Apply failed.",
      };
    }
    return res;
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      error: `Could not apply fills. (${errMsg})`,
    };
  }
}
