import type {
  AutofillExecutionOptions,
  AutofillFieldExecutionResult,
  ExtensionAutofillFill,
} from "@searchparty/shared";
import { normalizeSignalValue } from "@searchparty/shared";

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && "escape" in CSS) {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, "");
}

function isFillableElement(
  el: Element
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
  value: string
): void {
  const prototype =
    el instanceof HTMLInputElement
      ? HTMLInputElement.prototype
      : HTMLTextAreaElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(
    prototype,
    "value"
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
  rawValue: string
): boolean {
  const target = normalizeOptionValue(rawValue);
  if (!target) {
    return false;
  }

  const options = Array.from(el.options);
  const exact = options.find((option) => {
    const label = normalizeOptionValue(
      option.label || option.textContent || ""
    );
    const value = normalizeOptionValue(option.value);
    return label === target || value === target;
  });
  const fuzzy =
    exact ??
    options.find((option) => {
      const label = normalizeOptionValue(
        option.label || option.textContent || ""
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

function executeFieldInteraction(
  el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  value: string
): { ok: boolean; reason?: string } {
  if (el instanceof HTMLSelectElement) {
    if (!selectNativeOption(el, value)) {
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
    const checked = booleanFromValue(value);
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

  if (
    el instanceof HTMLInputElement &&
    (el.type === "radio" || el.type === "file")
  ) {
    return {
      ok: false,
      reason: `${el.type} inputs are detected but not filled yet.`,
    };
  }

  setElementValue(el, value);
  dispatchFillEvents(el);
  return el.value === value
    ? { ok: true }
    : { ok: false, reason: "Text value did not update." };
}

/** Safely applies autofill values to previously tagged controls. */
export function executeAutofill(
  fills: ExtensionAutofillFill[],
  options: AutofillExecutionOptions = {}
): {
  appliedSpIds: string[];
  results: AutofillFieldExecutionResult[];
} {
  const appliedSpIds: string[] = [];
  const results: AutofillFieldExecutionResult[] = [];
  const requireVisible = options.requireVisible ?? true;

  for (const { spId, value } of fills) {
    const el = document.querySelector(
      `[data-searchparty-autofill-id="${cssEscape(spId)}"]`
    );
    if (!el || !isFillableElement(el)) {
      results.push({
        spId,
        ok: false,
        reason: "Tagged field was not found or is unsupported.",
      });
      continue;
    }
    if (requireVisible && !isVisible(el)) {
      results.push({
        spId,
        ok: false,
        reason: "Field is not visible.",
      });
      continue;
    }
    if (
      !(el instanceof HTMLInputElement && el.type === "checkbox") &&
      !options.overwriteExisting &&
      el.value.trim().length > 0
    ) {
      results.push({
        spId,
        ok: false,
        reason: "Field already has a value.",
      });
      continue;
    }
    if (options.dryRun) {
      appliedSpIds.push(spId);
      results.push({ spId, ok: true });
      continue;
    }

    el.focus();
    const result = executeFieldInteraction(el, value);
    results.push({ spId, ...result });
    if (result.ok) {
      appliedSpIds.push(spId);
    }
  }

  return { appliedSpIds, results };
}
