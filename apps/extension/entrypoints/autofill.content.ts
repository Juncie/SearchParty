import {
  confidenceScoreToTier,
  extensionAutofillApplyMessageType,
  extensionAutofillGetScanMessageType,
  extensionAutofillScanMessageType,
  matchDomFieldToAutofill,
  type DomFieldSignals,
  type ScannedAutofillFieldPayload,
} from "@searchparty/shared";

let cachedScanFields: ScannedAutofillFieldPayload[] | null = null;

function clearPreviousMarkers() {
  document
    .querySelectorAll("[data-searchparty-autofill-id]")
    .forEach((node) => {
      node.removeAttribute("data-searchparty-autofill-id");
    });
}

function controlLabelText(control: HTMLElement): string {
  if (
    control instanceof HTMLInputElement ||
    control instanceof HTMLTextAreaElement ||
    control instanceof HTMLSelectElement
  ) {
    const lbs = control.labels;
    if (lbs && lbs.length > 0) {
      return Array.from(lbs)
        .map((node) => node.innerText.trim())
        .filter(Boolean)
        .join(" ");
    }
  }
  const aria = control.getAttribute("aria-label")?.trim() ?? "";
  if (aria) {
    return aria;
  }
  const labelledBy = control.getAttribute("aria-labelledby");
  if (labelledBy) {
    return labelledBy
      .split(/\s+/)
      .map(
        (id) => document.getElementById(id)?.textContent?.trim() ?? "",
      )
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

function shouldExposeField(score: number, signals: DomFieldSignals): boolean {
  if (score >= 45) {
    return true;
  }
  if (signals.autocomplete.trim().length > 0) {
    return true;
  }
  return false;
}

function scanDocumentForAutofill(): ScannedAutofillFieldPayload[] {
  clearPreviousMarkers();
  const candidates = document.querySelectorAll("input, textarea, select");
  const fields: ScannedAutofillFieldPayload[] = [];

  for (const raw of candidates) {
    if (
      !(
        raw instanceof HTMLInputElement ||
        raw instanceof HTMLTextAreaElement ||
        raw instanceof HTMLSelectElement
      )
    ) {
      continue;
    }
    const control = raw;
    if (control.disabled) {
      continue;
    }
    if (
      control instanceof HTMLInputElement &&
      (control.type === "hidden" ||
        control.type === "submit" ||
        control.type === "button" ||
        control.type === "image" ||
        control.type === "checkbox" ||
        control.type === "radio" ||
        control.type === "file" ||
        control.type === "range" ||
        control.type === "color")
    ) {
      continue;
    }
    if (control instanceof HTMLInputElement && control.readOnly) {
      continue;
    }

    const style = window.getComputedStyle(control);
    if (style.visibility === "hidden" || style.display === "none") {
      continue;
    }

    const tagName = control.tagName.toLowerCase();
    const type =
      control instanceof HTMLInputElement
        ? (control.type || "text").toLowerCase()
        : tagName === "select"
          ? "select-one"
          : "textarea";

    const labelText = controlLabelText(control);
    const signals: DomFieldSignals = {
      tagName,
      name: control.getAttribute("name") ?? "",
      id: control.id ?? "",
      type,
      placeholder: control.getAttribute("placeholder") ?? "",
      ariaLabel: control.getAttribute("aria-label") ?? "",
      autocomplete: control.getAttribute("autocomplete") ?? "",
      labelText,
    };

    const { kind, score } = matchDomFieldToAutofill(signals);
    if (!shouldExposeField(score, signals)) {
      continue;
    }

    const spId = globalThis.crypto.randomUUID();
    control.setAttribute("data-searchparty-autofill-id", spId);
    const tier = confidenceScoreToTier(score);
    const labelPreview =
      labelText ||
      signals.placeholder ||
      signals.name ||
      signals.id ||
      kind;

    fields.push({
      spId,
      kind,
      score,
      tier,
      labelPreview: labelPreview.slice(0, 120),
      currentValue:
        control instanceof HTMLSelectElement
          ? control.value
          : control.value,
      tagName,
    });
  }

  return fields;
}

function refreshAutofillScanCache(): ScannedAutofillFieldPayload[] {
  cachedScanFields = scanDocumentForAutofill();
  return cachedScanFields;
}

function getOrCreateAutofillScanCache(): ScannedAutofillFieldPayload[] {
  if (cachedScanFields !== null) {
    return cachedScanFields;
  }
  return refreshAutofillScanCache();
}

function scheduleInitialAutofillScan() {
  const run = () => {
    try {
      void refreshAutofillScanCache();
    } catch {
      /* ignore — panel can trigger an explicit scan */
    }
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
    { once: true },
  );
}

function applyAutofillFills(fills: { spId: string; value: string }[]) {
  for (const { spId, value } of fills) {
    const safeId =
      typeof CSS !== "undefined" && "escape" in CSS
        ? CSS.escape(spId)
        : spId.replace(/["\\]/g, "");
    const el = document.querySelector(
      `[data-searchparty-autofill-id="${safeId}"]`,
    );
    if (!el) {
      continue;
    }
    if (
      !(
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement
      )
    ) {
      continue;
    }
    if (el instanceof HTMLSelectElement) {
      el.value = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      continue;
    }
    el.focus();
    el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

export default defineContentScript({
  matches: ["http://*/*", "https://*/*"],
  main() {
    scheduleInitialAutofillScan();

    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (!message || typeof message !== "object" || !("type" in message)) {
        return undefined;
      }
      if (message.type === extensionAutofillGetScanMessageType) {
        try {
          const fields = getOrCreateAutofillScanCache();
          sendResponse({ ok: true, fields });
        } catch (error) {
          const msg =
            error instanceof Error ? error.message : "Scan failed.";
          sendResponse({ ok: false, error: msg });
        }
        return true;
      }
      if (message.type === extensionAutofillScanMessageType) {
        try {
          const fields = refreshAutofillScanCache();
          sendResponse({ ok: true, fields });
        } catch (error) {
          const msg =
            error instanceof Error ? error.message : "Scan failed.";
          sendResponse({ ok: false, error: msg });
        }
        return true;
      }
      if (
        message.type === extensionAutofillApplyMessageType &&
        "fills" in message &&
        Array.isArray(message.fills)
      ) {
        try {
          applyAutofillFills(
            message.fills as { spId: string; value: string }[],
          );
          sendResponse({ ok: true });
        } catch (error) {
          const msg =
            error instanceof Error ? error.message : "Apply failed.";
          sendResponse({ ok: false, error: msg });
        }
        return true;
      }
      return undefined;
    });
  },
});
