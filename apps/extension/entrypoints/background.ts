import {
  applyPanelOpenBehavior,
  extensionPreferenceMessageType,
} from "@/lib/extension-preferences";
import { extensionDebugAgentLogMessageType } from "@/lib/agent-debug-log";
import {
  extensionFetchBlobMessageType,
  type ExtensionFetchBlobMessage,
  type ExtensionFetchBlobResponse,
} from "@/lib/extension-fetch-blob";
import {
  extensionMainWorldAssignFileMessageType,
  type ExtensionMainWorldAssignFileMessage,
} from "@/lib/extension-main-world-assign";
import { RESUME_AUTOFILL_MAX_BYTES } from "@searchparty/shared";

const DEBUG_INGEST_URL =
  "http://127.0.0.1:7539/ingest/0a8e9746-11ca-43d9-8b26-b8265e0be1a8";
const DEBUG_SESSION = "210883";

/**
 * Injected into the page **MAIN** world so page JS (React, ATS widgets) observes
 * `HTMLInputElement.files` and bubbling events. Must stay self-contained.
 */
function searchPartyMainWorldAssignResume(arg: {
  selector: string;
  buffer: unknown;
  fileName: string;
  mimeType: string;
}): {
  ok: boolean;
  reason?: string;
  filesLen?: number;
} {
  const el = document.querySelector(arg.selector);
  if (!el || !(el instanceof HTMLInputElement)) {
    return {
      ok: false,
      reason: "Tagged field was not found or is not an input.",
      filesLen: 0,
    };
  }
  if (el.type !== "file") {
    return {
      ok: false,
      reason: "Tagged input is not type=file.",
      filesLen: 0,
    };
  }
  let bytes: Uint8Array;
  const rawBuf = arg.buffer;
  if (rawBuf instanceof ArrayBuffer) {
    bytes = new Uint8Array(rawBuf);
  } else if (ArrayBuffer.isView(rawBuf)) {
    const v = rawBuf as ArrayBufferView;
    bytes = new Uint8Array(
      v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength),
    );
  } else {
    return {
      ok: false,
      reason: "Invalid résumé byte payload.",
      filesLen: 0,
    };
  }
  const file = new File(
    [new Uint8Array(bytes)],
    arg.fileName,
    {
      type: arg.mimeType || "application/pdf",
    },
  );
  const dt = new DataTransfer();
  dt.items.add(file);
  el.files = dt.files;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
  el.dispatchEvent(new Event("blur", { bubbles: true }));
  const filesLen = el.files?.length ?? 0;
  return {
    ok: filesLen === 1,
    reason:
      filesLen === 1
        ? undefined
        : "The file input did not accept the attachment.",
    filesLen,
  };
}

export default defineBackground(() => {
  void applyPanelOpenBehavior();

  browser.runtime.onInstalled.addListener(() => {
    void applyPanelOpenBehavior();
  });

  browser.runtime.onMessage.addListener(
    (
      message: unknown,
      sender,
      sendResponse: (response?: unknown) => void,
    ) => {
      if (
        typeof message === "object" &&
        message !== null &&
        "type" in message &&
        message.type === extensionPreferenceMessageType
      ) {
        void applyPanelOpenBehavior();
      }
      if (
        typeof message === "object" &&
        message !== null &&
        "type" in message &&
        message.type === extensionDebugAgentLogMessageType
      ) {
        const payload = message as Record<string, unknown>;
        void fetch(DEBUG_INGEST_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": DEBUG_SESSION,
          },
          body: JSON.stringify({
            sessionId: DEBUG_SESSION,
            timestamp: Date.now(),
            ...payload,
          }),
        }).catch(() => { });
      }
      if (
        typeof message === "object" &&
        message !== null &&
        "type" in message &&
        message.type === extensionFetchBlobMessageType &&
        "url" in message &&
        typeof (message as ExtensionFetchBlobMessage).url === "string"
      ) {
        const url = (message as ExtensionFetchBlobMessage).url.trim();
        if (!/^https?:\/\//i.test(url)) {
          sendResponse({
            ok: false,
            error: "Only http(s) download URLs are allowed.",
          });
          return undefined;
        }
        void (async () => {
          let host = "";
          try {
            host = new URL(url).hostname;
          } catch {
            host = "(invalid)";
          }
          try {
            const res = await fetch(url);
            if (!res.ok) {
              sendResponse({
                ok: false,
                error: `HTTP ${String(res.status)}`,
              });
              return;
            }
            const lenHeader = res.headers.get("content-length");
            if (lenHeader) {
              const n = Number(lenHeader);
              if (
                Number.isFinite(n) &&
                n > RESUME_AUTOFILL_MAX_BYTES
              ) {
                sendResponse({
                  ok: false,
                  error: "Résumé exceeds the autofill size limit.",
                });
                return;
              }
            }
            const buffer = await res.arrayBuffer();
            if (buffer.byteLength > RESUME_AUTOFILL_MAX_BYTES) {
              sendResponse({
                ok: false,
                error: "Résumé exceeds the autofill size limit.",
              });
              return;
            }
            const contentType =
              res.headers.get("content-type")?.split(";")[0]?.trim() ??
              "application/octet-stream";
            void fetch(DEBUG_INGEST_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Debug-Session-Id": DEBUG_SESSION,
              },
              body: JSON.stringify({
                sessionId: DEBUG_SESSION,
                timestamp: Date.now(),
                hypothesisId: "H-bg-fetch",
                location: "background.ts:fetch-blob",
                message: "Background fetch resume ok",
                data: {
                  host,
                  bytes: buffer.byteLength,
                  contentType,
                },
              }),
            }).catch(() => { });
            sendResponse({
              ok: true,
              buffer,
              contentType,
            });
          } catch (error: unknown) {
            const errMsg =
              error instanceof Error
                ? error.message
                : String(error);
            void fetch(DEBUG_INGEST_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Debug-Session-Id": DEBUG_SESSION,
              },
              body: JSON.stringify({
                sessionId: DEBUG_SESSION,
                timestamp: Date.now(),
                hypothesisId: "H-bg-fetch-err",
                location: "background.ts:fetch-blob",
                message: "Background fetch resume failed",
                data: { host, errMsg },
              }),
            }).catch(() => { });
            sendResponse({
              ok: false,
              error: errMsg,
            });
          }
        })();
        return true;
      }
      if (
        typeof message === "object" &&
        message !== null &&
        "type" in message &&
        message.type === extensionMainWorldAssignFileMessageType &&
        "selector" in message &&
        "buffer" in message &&
        "fileName" in message &&
        "mimeType" in message
      ) {
        const tabId = sender.tab?.id;
        if (tabId === undefined) {
          sendResponse({
            ok: false,
            error: "No sender tab for MAIN-world assign.",
          });
          return undefined;
        }
        const payload = message as ExtensionMainWorldAssignFileMessage;
        void (async () => {
          try {
            const injected =
              await browser.scripting.executeScript({
                target: { tabId },
                world: "MAIN",
                func: searchPartyMainWorldAssignResume,
                args: [
                  {
                    selector: payload.selector,
                    buffer: payload.buffer,
                    fileName: payload.fileName,
                    mimeType: payload.mimeType,
                  },
                ],
              });
            const result = injected[0]?.result as
              | ReturnType<typeof searchPartyMainWorldAssignResume>
              | undefined;
            void fetch(DEBUG_INGEST_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Debug-Session-Id": DEBUG_SESSION,
              },
              body: JSON.stringify({
                sessionId: DEBUG_SESSION,
                timestamp: Date.now(),
                hypothesisId: "H-main-world-exec",
                location: "background.ts:main-world-assign",
                message: "MAIN world resume assign finished",
                data: {
                  ok: result?.ok ?? false,
                  filesLen: result?.filesLen,
                },
              }),
            }).catch(() => { });
            sendResponse({
              ok: true,
              result: result ?? {
                ok: false,
                reason: "No injection result.",
              },
            });
          } catch (error: unknown) {
            const errMsg =
              error instanceof Error
                ? error.message
                : String(error);
            void fetch(DEBUG_INGEST_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Debug-Session-Id": DEBUG_SESSION,
              },
              body: JSON.stringify({
                sessionId: DEBUG_SESSION,
                timestamp: Date.now(),
                hypothesisId: "H-main-world-exec-err",
                location: "background.ts:main-world-assign",
                message: "executeScript failed",
                data: { errMsg },
              }),
            }).catch(() => { });
            sendResponse({
              ok: false,
              error: errMsg,
            });
          }
        })();
        return true;
      }
      return undefined;
    },
  );
});
