import { beforeEach, describe, expect, it } from "vitest";

import {
  cssPathForElement,
  extractDomFieldSignals,
  extractDomFields,
} from "../extractDomFields";
import { executeAutofill } from "../executeAutofill";

describe("extractDomFields", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("captures labels, form context, required state, and selector paths", () => {
    document.body.innerHTML = `
      <form>
        <fieldset>
          <legend>Contact information</legend>
          <label for="email">Email address</label>
          <input id="email" name="candidateEmail" type="email" required />
        </fieldset>
      </form>
    `;

    const fields = extractDomFields();

    expect(fields).toHaveLength(1);
    expect(fields[0]?.signals).toMatchObject({
      type: "email",
      name: "candidateEmail",
      labelText: "Email address",
      parentSectionText: "Contact information",
      isRequired: true,
      isVisible: true,
      isDisabled: false,
    });
    expect(fields[0]?.signals.cssPath).toContain(
      "input#email"
    );
  });

  it("captures aria-labelledby text and select options", () => {
    document.body.innerHTML = `
      <span id="profile-label">Professional profile</span>
      <select aria-labelledby="profile-label" name="profile">
        <option value="">Choose one</option>
        <option value="linkedin">LinkedIn</option>
        <option value="portfolio">Portfolio</option>
      </select>
    `;

    const control = document.querySelector("select");
    expect(control).toBeInstanceOf(HTMLSelectElement);

    const signals = extractDomFieldSignals(
      control as HTMLSelectElement
    );

    expect(signals.labelText).toBe("Professional profile");
    expect(signals.options).toEqual([
      "Choose one",
      "LinkedIn linkedin",
      "Portfolio portfolio",
    ]);
    expect(signals.interactionType).toBe("select");
  });

  it("captures checkbox, radio, and file controls as application interactions", () => {
    document.body.innerHTML = `
      <form>
        <label><input name="sms" type="checkbox" /> Please agree to receive SMS messages</label>
        <fieldset>
          <legend>Reference relationship</legend>
          <label><input name="relationship" type="radio" value="professional" /> Professional</label>
          <label><input name="relationship" type="radio" value="personal" /> Personal</label>
        </fieldset>
        <label for="resume">Resume</label>
        <input id="resume" type="file" />
      </form>
    `;

    const fields = extractDomFields();

    expect(fields.map((field) => field.signals.interactionType)).toEqual([
      "checkbox",
      "radio",
      "radio",
      "file",
    ]);
    expect(fields[1]?.signals.options).toEqual([
      "Professional",
      "Personal",
    ]);
  });

  it("walks open shadow roots", () => {
    document.body.innerHTML = '<div id="host"></div>';
    const host = document.getElementById("host");
    const shadow = host?.attachShadow({ mode: "open" });
    if (!shadow) {
      throw new Error("Expected shadow root.");
    }
    shadow.innerHTML =
      '<label>Phone<input name="phone" type="tel" /></label>';

    const fields = extractDomFields();

    expect(fields).toHaveLength(1);
    expect(fields[0]?.signals.type).toBe("tel");
    expect(fields[0]?.signals.labelText).toBe("Phone");
  });
});

describe("cssPathForElement", () => {
  it("falls back to nth-of-type paths when no id or name exists", () => {
    document.body.innerHTML =
      "<form><input /><input /></form>";
    const second = document.querySelectorAll("input")[1];
    if (!second) {
      throw new Error("Expected second input.");
    }

    expect(cssPathForElement(second)).toContain(
      "input:nth-of-type(2)"
    );
  });
});

describe("executeAutofill", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("does not overwrite non-empty fields by default", () => {
    document.body.innerHTML =
      '<input data-searchparty-autofill-id="a" value="existing" />';

    const result = executeAutofill([
      { spId: "a", value: "new" },
    ]);

    expect(result.appliedSpIds).toEqual([]);
    expect(document.querySelector("input")?.value).toBe(
      "existing"
    );
  });

  it("fills empty fields and dispatches browser events", () => {
    document.body.innerHTML =
      '<input data-searchparty-autofill-id="a" />';
    const input = document.querySelector("input");
    const events: string[] = [];
    input?.addEventListener("input", () =>
      events.push("input")
    );
    input?.addEventListener("change", () =>
      events.push("change")
    );
    input?.addEventListener("blur", () =>
      events.push("blur")
    );

    const result = executeAutofill([
      { spId: "a", value: "Jamie" },
    ]);

    expect(result.appliedSpIds).toEqual(["a"]);
    expect(input?.value).toBe("Jamie");
    expect(events).toEqual(["input", "change", "blur"]);
  });

  it("matches native select options by visible label and verifies the result", () => {
    document.body.innerHTML = `
      <select data-searchparty-autofill-id="country">
        <option value="">Choose one</option>
        <option value="US">United States</option>
      </select>
    `;

    const result = executeAutofill([
      { spId: "country", value: "United States" },
    ]);

    expect(result.appliedSpIds).toEqual(["country"]);
    expect(document.querySelector("select")?.value).toBe("US");
    expect(result.results).toEqual([
      { spId: "country", ok: true },
    ]);
  });

  it("sets checkbox state without double toggling", () => {
    document.body.innerHTML =
      '<input type="checkbox" data-searchparty-autofill-id="sms" />';

    const result = executeAutofill([
      { spId: "sms", value: "true" },
    ]);

    expect(result.appliedSpIds).toEqual(["sms"]);
    expect(
      document.querySelector<HTMLInputElement>("input")?.checked
    ).toBe(true);
  });

  it("reports verification failures without recording applied ids", () => {
    document.body.innerHTML = `
      <select data-searchparty-autofill-id="country">
        <option value="">Choose one</option>
        <option value="US">United States</option>
      </select>
    `;

    const result = executeAutofill([
      { spId: "country", value: "Atlantis" },
    ]);

    expect(result.appliedSpIds).toEqual([]);
    expect(result.results[0]).toMatchObject({
      spId: "country",
      ok: false,
    });
  });
});
