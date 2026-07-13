import {
  extensionAutofillApplyMessageType,
  extensionAutofillGetScanMessageType,
  extensionAutofillScanMessageType,
  matchDomFieldToAutofillDetailed,
  type AutofillFieldKind,
  type AutofillFillStatus,
  type AutofillInteractionType,
  type ExtensionAutofillApplyMessage,
  type ScannedAutofillFieldPayload,
} from "@searchparty/shared";

import {
  currentDomainMemoryKey,
  readDomainMemoryHint,
  recordAcceptedAutofillMatches,
} from "@/lib/autofill/domainMemory";
import { agentDebugLog } from "@/lib/agent-debug-log";
import { executeAutofill } from "@/lib/autofill/executeAutofill";
import { extractDomFields } from "@/lib/autofill/extractDomFields";

let cachedScanFields: ScannedAutofillFieldPayload[] | null =
  null;

function clearPreviousMarkers() {
  document
    .querySelectorAll("[data-searchparty-autofill-id]")
    .forEach((node) => {
      node.removeAttribute("data-searchparty-autofill-id");
    });
}

function shouldExposeField(
  field: ScannedAutofillFieldPayload
): boolean {
  return field.tier !== "ignore";
}

/**
 * Kinds that stay manual even when text/textarea/select interactions are
 * supported — they need explicit user consent or approved generated content.
 */
const MANUAL_VALUE_KINDS: ReadonlySet<AutofillFieldKind> =
  new Set(["coverLetter", "smsConsent"]);

/** Native radio kinds with confirmed Yes/No style account or preference answers. */
const RADIO_FILLABLE_KINDS: ReadonlySet<AutofillFieldKind> = new Set([
  "workAuthorization",
  "requiresSponsorship",
  "openToRelocation",
]);

function fillStatusForField(
  kind: AutofillFieldKind,
  interactionType: AutofillInteractionType
): {
  fillStatus: AutofillFillStatus;
  unsupportedReason?: string;
} {
  if (kind === "smsConsent") {
    return {
      fillStatus: "manual",
      unsupportedReason:
        "Consent checkboxes need an explicit user choice before SearchParty fills them.",
    };
  }
  if (kind === "coverLetter") {
    return {
      fillStatus: "manual",
      unsupportedReason:
        "Cover letters need an approved draft before SearchParty can fill them.",
    };
  }
  if (interactionType === "file" && kind === "resume") {
    return { fillStatus: "fillable" };
  }
  if (
    interactionType === "radio" &&
    RADIO_FILLABLE_KINDS.has(kind)
  ) {
    return { fillStatus: "fillable" };
  }
  if (
    interactionType === "file" ||
    interactionType === "button" ||
    interactionType === "radio" ||
    interactionType === "combobox" ||
    interactionType === "unknown"
  ) {
    return {
      fillStatus: "unsupported",
      unsupportedReason: `${interactionType} controls are detected but not automatically filled yet.`,
    };
  }
  if (MANUAL_VALUE_KINDS.has(kind)) {
    return {
      fillStatus: "manual",
      unsupportedReason:
        "This field needs profile data or generated content that SearchParty does not apply yet.",
    };
  }
  return { fillStatus: "fillable" };
}

function labelPreviewForField(
  field: Pick<ScannedAutofillFieldPayload, "kind">,
  signals: ReturnType<
    typeof extractDomFields
  >[number]["signals"]
): string {
  return (
    signals.labelText ||
    signals.placeholder ||
    signals.name ||
    signals.id ||
    signals.nearbyText ||
    field.kind
  ).slice(0, 120);
}

function currentValueForControl(
  control: ReturnType<typeof extractDomFields>[number]["control"]
): string {
  if (control instanceof HTMLInputElement) {
    if (control.type === "checkbox" || control.type === "radio") {
      return control.checked ? "checked" : "";
    }
    if (control.type === "file") {
      return Array.from(control.files ?? [])
        .map((file) => file.name)
        .join(", ");
    }
  }
  if (control instanceof HTMLButtonElement) {
    return (control.textContent ?? "").trim();
  }
  return control.value;
}

async function scanDocumentForAutofill(): Promise<
  ScannedAutofillFieldPayload[]
> {
  clearPreviousMarkers();
  const fields: ScannedAutofillFieldPayload[] = [];
  const domain = currentDomainMemoryKey();

  for (const { control, signals } of extractDomFields()) {
    if (control.disabled) {
      continue;
    }
    const memoryHint = await readDomainMemoryHint(
      domain,
      signals.cssPath
    );
    const result = matchDomFieldToAutofillDetailed(
      signals,
      memoryHint
    );
    const spId = globalThis.crypto.randomUUID();
    const interactionType = signals.interactionType ?? "unknown";
    const fillSupport = fillStatusForField(
      result.kind,
      interactionType
    );
    const field: ScannedAutofillFieldPayload = {
      spId,
      kind: result.kind,
      score: result.score,
      tier:
        result.kind === "smsConsent" && result.tier === "auto"
          ? "confirm"
          : result.tier,
      labelPreview: labelPreviewForField(result, signals),
      currentValue: currentValueForControl(control),
      tagName: signals.tagName,
      interactionType,
      ...fillSupport,
      cssPath: signals.cssPath,
      options: signals.options,
      reasons: result.reasons,
      penalties: result.penalties,
    };

    if (!shouldExposeField(field)) {
      continue;
    }

    control.setAttribute(
      "data-searchparty-autofill-id",
      spId
    );
    fields.push(field);
  }

  return fields;
}

async function refreshAutofillScanCache(): Promise<
  ScannedAutofillFieldPayload[]
> {
  cachedScanFields = await scanDocumentForAutofill();
  return cachedScanFields;
}

async function getOrCreateAutofillScanCache(): Promise<
  ScannedAutofillFieldPayload[]
> {
  if (cachedScanFields !== null) {
    return cachedScanFields;
  }
  return refreshAutofillScanCache();
}

function scheduleInitialAutofillScan() {
  const run = () => {
    void refreshAutofillScanCache().catch(() => {
      /* ignore - panel can trigger an explicit scan */
    });
  };
  if (document.readyState !== "loading") {
    queueMicrotask(run);
    return;
  }
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      queueMicrotask(run);
    },
    { once: true }
  );
}

async function recordAppliedFields(
  appliedSpIds: string[]
): Promise<void> {
  if (!cachedScanFields || appliedSpIds.length === 0) {
    return;
  }
  const applied = new Set(appliedSpIds);
  await recordAcceptedAutofillMatches(
    currentDomainMemoryKey(),
    cachedScanFields
      .filter((field) => applied.has(field.spId))
      .map((field) => ({
        fieldSelector: field.cssPath,
        kind: field.kind,
      }))
  );
}

export default defineContentScript({
  matches: ["http://*/*", "https://*/*"],
  main() {
    // #region agent log
    agentDebugLog({
      hypothesisId: "H-inject",
      location: "autofill.content.ts:main",
      message: "Autofill content script loaded",
      data: {
        origin: globalThis.location?.origin ?? "",
        pathLen: (globalThis.location?.pathname ?? "").length,
      },
    });
    // #endregion
    scheduleInitialAutofillScan();

    browser.runtime.onMessage.addListener(
      (message, _sender, sendResponse) => {
        if (
          !message ||
          typeof message !== "object" ||
          !("type" in message)
        ) {
          return undefined;
        }

        if (
          message.type ===
          extensionAutofillGetScanMessageType
        ) {
          void getOrCreateAutofillScanCache()
            .then((fields) =>
              sendResponse({ ok: true, fields })
            )
            .catch((error: unknown) => {
              const msg =
                error instanceof Error
                  ? error.message
                  : "Scan failed.";
              sendResponse({ ok: false, error: msg });
            });
          return true;
        }

        if (
          message.type === extensionAutofillScanMessageType
        ) {
          void refreshAutofillScanCache()
            .then((fields) =>
              sendResponse({ ok: true, fields })
            )
            .catch((error: unknown) => {
              const msg =
                error instanceof Error
                  ? error.message
                  : "Scan failed.";
              sendResponse({ ok: false, error: msg });
            });
          return true;
        }

        if (
          message.type ===
          extensionAutofillApplyMessageType &&
          "fills" in message &&
          Array.isArray(message.fills)
        ) {
          const applyMessage =
            message as ExtensionAutofillApplyMessage;
          void (async () => {
            try {
              const { appliedSpIds, results } = await executeAutofill(
                applyMessage.fills,
                applyMessage.options,
              );
              void recordAppliedFields(appliedSpIds).catch(
                () => {
                  /* memory is helpful, but filling should not fail if storage does */
                },
              );
              sendResponse({ ok: true, appliedSpIds, results });
            } catch (error) {
              const msg =
                error instanceof Error
                  ? error.message
                  : "Apply failed.";
              sendResponse({ ok: false, error: msg });
            }
          })();
          return true;
        }

        return undefined;
      }
    );
  },
});
