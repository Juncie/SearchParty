import type {
  AutofillInteractionType,
  DomFieldSignals,
} from "@searchparty/shared";

export type AutofillControl =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLButtonElement;

export type ExtractedAutofillField = {
  control: AutofillControl;
  signals: DomFieldSignals;
};

const INPUT_TYPES_TO_SKIP = new Set([
  "hidden",
  "submit",
  "button",
  "image",
  "range",
  "color",
  "reset",
]);

const BUTTON_TEXT_TO_INCLUDE = /\b(upload|resume|cv|linkedin|linked in)\b/i;

function compactText(
  value: string | null | undefined,
  maxLength = 180
): string {
  return (value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && "escape" in CSS) {
    return CSS.escape(value);
  }
  return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

function isAutofillControl(
  node: Element
): node is AutofillControl {
  return (
    node instanceof HTMLInputElement ||
    node instanceof HTMLTextAreaElement ||
    node instanceof HTMLSelectElement ||
    node instanceof HTMLButtonElement
  );
}

function isSupportedControl(
  control: AutofillControl
): boolean {
  if (control instanceof HTMLInputElement) {
    return !INPUT_TYPES_TO_SKIP.has(
      (control.type || "text").toLowerCase()
    );
  }
  if (control instanceof HTMLButtonElement) {
    return (
      control.getAttribute("aria-haspopup") === "listbox" ||
      control.getAttribute("role") === "combobox" ||
      BUTTON_TEXT_TO_INCLUDE.test(control.textContent ?? "")
    );
  }
  return true;
}

function isVisible(control: HTMLElement): boolean {
  const style = window.getComputedStyle(control);
  if (
    style.visibility === "hidden" ||
    style.display === "none"
  ) {
    return false;
  }
  if (
    control.hidden ||
    control.getAttribute("aria-hidden") === "true"
  ) {
    return false;
  }
  return true;
}

function labelledByText(control: HTMLElement): string {
  const labelledBy = control.getAttribute(
    "aria-labelledby"
  );
  if (!labelledBy) {
    return "";
  }
  return compactText(
    labelledBy
      .split(/\s+/)
      .map(
        (id) =>
          control.ownerDocument.getElementById(id)
            ?.textContent ?? ""
      )
      .filter(Boolean)
      .join(" ")
  );
}

function controlLabelText(
  control: AutofillControl
): string {
  const labels =
    control instanceof HTMLButtonElement
      ? control.labels
      : control.labels;
  if (labels && labels.length > 0) {
    return compactText(
      Array.from(labels)
        .map((node) => node.textContent ?? "")
        .filter(Boolean)
        .join(" ")
    );
  }

  const labelledBy = labelledByText(control);
  if (labelledBy) {
    return labelledBy;
  }

  const wrappedLabel = control.closest("label");
  if (wrappedLabel) {
    return compactText(wrappedLabel.textContent);
  }

  if (control.id) {
    const explicit = control.ownerDocument.querySelector(
      `label[for="${cssEscape(control.id)}"]`
    );
    if (explicit) {
      return compactText(explicit.textContent);
    }
  }

  return "";
}

function nearbyText(control: HTMLElement): string {
  const chunks = [
    control.previousElementSibling?.textContent,
    control.nextElementSibling?.textContent,
    control.parentElement?.querySelector("span, p, small")
      ?.textContent,
  ];
  return compactText(chunks.filter(Boolean).join(" "), 240);
}

function parentSectionText(control: HTMLElement): string {
  const fieldset = control.closest("fieldset");
  if (fieldset) {
    const legend = fieldset.querySelector("legend");
    if (legend) {
      return compactText(legend.textContent, 180);
    }
  }

  const section = control.closest(
    "section, article, aside, main, div"
  );
  const heading = section?.querySelector(
    "h1, h2, h3, h4, h5, h6"
  );
  return compactText(heading?.textContent, 180);
}

function formText(control: AutofillControl): string {
  return compactText(control.form?.textContent, 500);
}

function classifyInteractionType(
  control: AutofillControl
): AutofillInteractionType {
  const role = control.getAttribute("role");
  const hasListboxPopup =
    control.getAttribute("aria-haspopup") === "listbox";
  if (role === "combobox" || hasListboxPopup) {
    return "combobox";
  }
  if (control instanceof HTMLTextAreaElement) {
    return "textarea";
  }
  if (control instanceof HTMLSelectElement) {
    return "select";
  }
  if (control instanceof HTMLButtonElement) {
    return "button";
  }
  const type = (control.type || "text").toLowerCase();
  if (type === "checkbox") {
    return "checkbox";
  }
  if (type === "radio") {
    return "radio";
  }
  if (type === "file") {
    return "file";
  }
  return "text";
}

function controlType(control: AutofillControl): string {
  if (control instanceof HTMLInputElement) {
    return (control.type || "text").toLowerCase();
  }
  if (control instanceof HTMLSelectElement) {
    return control.multiple
      ? "select-multiple"
      : "select-one";
  }
  if (control instanceof HTMLButtonElement) {
    return control.type || "button";
  }
  return "textarea";
}

function selectOptions(
  control: AutofillControl
): string[] | undefined {
  if (control instanceof HTMLSelectElement) {
    return Array.from(control.options)
      .map((option) => {
        const label =
          option.label || option.textContent || "";
        return compactText(`${label} ${option.value}`, 120);
      })
      .filter(Boolean);
  }

  if (
    control instanceof HTMLInputElement &&
    control.type === "radio" &&
    control.name
  ) {
    const owner = control.form ?? control.ownerDocument;
    const selector = `input[type="radio"][name="${cssEscape(control.name)}"]`;
    return Array.from(owner.querySelectorAll(selector))
      .map((radio) =>
        radio instanceof HTMLInputElement
          ? controlLabelText(radio) || radio.value
          : ""
      )
      .map((value) => compactText(value, 120))
      .filter(Boolean);
  }

  return undefined;
}

function nthOfType(element: Element): number {
  let index = 1;
  let sibling = element.previousElementSibling;
  while (sibling) {
    if (sibling.tagName === element.tagName) {
      index += 1;
    }
    sibling = sibling.previousElementSibling;
  }
  return index;
}

/** Builds a best-effort stable CSS path for rescanning and per-domain memory. */
export function cssPathForElement(
  element: Element
): string {
  const parts: string[] = [];
  let current: Element | null = element;

  while (
    current &&
    current.nodeType === Node.ELEMENT_NODE
  ) {
    const tag = current.tagName.toLowerCase();
    if (current.id) {
      parts.unshift(`${tag}#${cssEscape(current.id)}`);
      break;
    }

    const name = current.getAttribute("name");
    if (
      name &&
      isAutofillControl(current) &&
      !(current instanceof HTMLButtonElement)
    ) {
      parts.unshift(`${tag}[name="${cssEscape(name)}"]`);
      break;
    }

    parts.unshift(
      `${tag}:nth-of-type(${nthOfType(current)})`
    );
    current = current.parentElement;
  }

  return parts.join(" > ");
}

/** Converts one supported DOM control into the signals used by the shared matcher. */
export function extractDomFieldSignals(
  control: AutofillControl
): DomFieldSignals {
  const interactionType = classifyInteractionType(control);
  const labelledBy = control.getAttribute("aria-labelledby") ?? "";
  return {
    tagName: control.tagName.toLowerCase(),
    role: control.getAttribute("role") ?? "",
    name: control.getAttribute("name") ?? "",
    id: control.id ?? "",
    type: controlType(control),
    placeholder: control.getAttribute("placeholder") ?? "",
    ariaLabel: control.getAttribute("aria-label") ?? "",
    ariaLabelledBy: labelledBy,
    autocomplete:
      control.getAttribute("autocomplete") ?? "",
    labelText: controlLabelText(control),
    nearbyText: nearbyText(control),
    parentSectionText: parentSectionText(control),
    formText: formText(control),
    options: selectOptions(control),
    interactionType,
    isVisible: isVisible(control),
    isDisabled: control.disabled,
    isRequired:
      (control instanceof HTMLInputElement ||
        control instanceof HTMLTextAreaElement ||
        control instanceof HTMLSelectElement
        ? control.required
        : false) ||
      control.getAttribute("aria-required") === "true",
    isChecked:
      control instanceof HTMLInputElement &&
        (control.type === "checkbox" || control.type === "radio")
        ? control.checked
        : undefined,
    cssPath: cssPathForElement(control),
  };
}

function collectControls(
  root: Document | ShadowRoot
): AutofillControl[] {
  const controls: AutofillControl[] = [];
  for (const node of root.querySelectorAll(
    'input, textarea, select, button[aria-haspopup="listbox"], button[role="combobox"], button'
  )) {
    if (
      isAutofillControl(node) &&
      isSupportedControl(node)
    ) {
      controls.push(node);
    }
  }

  for (const node of root.querySelectorAll("*")) {
    if (node.shadowRoot) {
      controls.push(...collectControls(node.shadowRoot));
    }
  }

  return controls;
}

/** Extracts all supported controls from a document or open shadow-root tree. */
export function extractDomFields(
  root: Document | ShadowRoot = document
): ExtractedAutofillField[] {
  return collectControls(root).map((control) => ({
    control,
    signals: extractDomFieldSignals(control),
  }));
}
