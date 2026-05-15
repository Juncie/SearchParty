/** Background performs `fetch` for blobs the content script cannot load (e.g. CORS). */
export const extensionFetchBlobMessageType =
  "searchparty/extension/fetch-blob" as const;

export type ExtensionFetchBlobMessage = {
  type: typeof extensionFetchBlobMessageType;
  url: string;
};

export type ExtensionFetchBlobResponse =
  | { ok: true; buffer: ArrayBuffer; contentType: string }
  | { ok: false; error: string };

/** Chrome structured-clone may deliver bytes as ArrayBuffer or a typed array. */
function toArrayBufferFromMessage(value: unknown): ArrayBuffer | null {
  if (value instanceof ArrayBuffer) {
    return value;
  }
  if (ArrayBuffer.isView(value)) {
    const v = value as ArrayBufferView;
    const copy = new Uint8Array(v.byteLength);
    copy.set(new Uint8Array(v.buffer, v.byteOffset, v.byteLength));
    return copy.buffer;
  }
  return null;
}

/**
 * Loads bytes for an http(s) URL via the service worker (host_permissions),
 * with a Vitest / non-extension fallback to `fetch` in the caller context.
 */
export async function fetchBlobViaExtension(
  url: string,
): Promise<ExtensionFetchBlobResponse> {
  if (
    typeof browser !== "undefined" &&
    typeof browser.runtime?.sendMessage === "function"
  ) {
    try {
      const raw: unknown = await browser.runtime.sendMessage({
        type: extensionFetchBlobMessageType,
        url,
      } satisfies ExtensionFetchBlobMessage);
      if (
        raw &&
        typeof raw === "object" &&
        "ok" in raw &&
        (raw as ExtensionFetchBlobResponse).ok === true &&
        "buffer" in raw
      ) {
        const buffer = toArrayBufferFromMessage(
          (raw as { buffer: unknown }).buffer,
        );
        const contentTypeRaw = (raw as { contentType?: unknown })
          .contentType;
        const contentType =
          typeof contentTypeRaw === "string" &&
            contentTypeRaw.trim().length > 0
            ? contentTypeRaw.trim()
            : "application/octet-stream";
        if (buffer !== null) {
          return {
            ok: true,
            buffer,
            contentType,
          };
        }
      }
      if (
        raw &&
        typeof raw === "object" &&
        "ok" in raw &&
        (raw as ExtensionFetchBlobResponse).ok === false &&
        "error" in raw
      ) {
        return raw as ExtensionFetchBlobResponse;
      }
      return {
        ok: false,
        error: "Unexpected response from the extension background.",
      };
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        error: msg,
      };
    }
  }
  return {
    ok: false,
    error: "Extension messaging is not available.",
  };
}
