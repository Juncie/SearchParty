import { beforeEach, describe, expect, it, vi } from "vitest";

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

  it("does not overwrite non-empty fields by default", async () => {
    document.body.innerHTML =
      '<input data-searchparty-autofill-id="a" value="existing" />';

    const result = await executeAutofill([
      { spId: "a", value: "new" },
    ]);

    expect(result.appliedSpIds).toEqual([]);
    expect(document.querySelector("input")?.value).toBe(
      "existing",
    );
  });

  it("fills empty fields and dispatches browser events", async () => {
    document.body.innerHTML =
      '<input data-searchparty-autofill-id="a" />';
    const input = document.querySelector("input");
    const events: string[] = [];
    input?.addEventListener("input", () =>
      events.push("input"),
    );
    input?.addEventListener("change", () =>
      events.push("change"),
    );
    input?.addEventListener("blur", () =>
      events.push("blur"),
    );

    const result = await executeAutofill([
      { spId: "a", value: "Jamie" },
    ]);

    expect(result.appliedSpIds).toEqual(["a"]);
    expect(input?.value).toBe("Jamie");
    expect(events).toEqual(["input", "change", "blur"]);
  });

  it("matches native select options by visible label and verifies the result", async () => {
    document.body.innerHTML = `
      <select data-searchparty-autofill-id="country">
        <option value="">Choose one</option>
        <option value="US">United States</option>
      </select>
    `;

    const result = await executeAutofill([
      { spId: "country", value: "United States" },
    ]);

    expect(result.appliedSpIds).toEqual(["country"]);
    expect(document.querySelector("select")?.value).toBe("US");
    expect(result.results).toEqual([
      { spId: "country", ok: true },
    ]);
  });

  it("sets checkbox state without double toggling", async () => {
    document.body.innerHTML =
      '<input type="checkbox" data-searchparty-autofill-id="sms" />';

    const result = await executeAutofill([
      { spId: "sms", value: "true" },
    ]);

    expect(result.appliedSpIds).toEqual(["sms"]);
    expect(
      document.querySelector<HTMLInputElement>("input")?.checked,
    ).toBe(true);
  });

  it("attaches a data URL to a file input", async () => {
    document.body.innerHTML =
      '<input type="file" data-searchparty-autofill-id="cv" />';
    const input = document.querySelector<HTMLInputElement>(
      "input[type=file]",
    );
    const dataUrl = "data:text/plain;base64,SGVsbG8=";

    const result = await executeAutofill([
      {
        spId: "cv",
        value: "",
        fileDataUrl: dataUrl,
        fileName: "test-resume.txt",
      },
    ]);

    expect(result.appliedSpIds).toEqual(["cv"]);
    expect(input?.files?.length).toBe(1);
    expect(input?.files?.[0]?.name).toBe("test-resume.txt");
  });

  it("attaches a file fetched from an HTTPS URL (presigned resume)", async () => {
    document.body.innerHTML =
      '<input type="file" data-searchparty-autofill-id="cv" />';
    const input = document.querySelector<HTMLInputElement>(
      "input[type=file]",
    );

    const stub = vi.fn(
      async (): Promise<Response> =>
        new Response(new Blob(["hello"], { type: "application/pdf" }), {
          status: 200,
          headers: { "Content-Type": "application/pdf" },
        }),
    );
    vi.stubGlobal("fetch", stub);

    try {
      const result = await executeAutofill([
        {
          spId: "cv",
          value: "",
          fileDownloadUrl:
            "https://cdn.example.test/resume.pdf?sig=abc",
          fileName: "Brandon-Mitchell-Resume.pdf",
        },
      ]);

      expect(stub).toHaveBeenCalledTimes(1);
      expect(result.appliedSpIds).toEqual(["cv"]);
      expect(input?.files?.length).toBe(1);
      expect(input?.files?.[0]?.name).toBe(
        "Brandon-Mitchell-Resume.pdf",
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("prefers fileDownloadUrl over fileDataUrl when both are set", async () => {
    document.body.innerHTML =
      '<input type="file" data-searchparty-autofill-id="cv" />';
    const input = document.querySelector<HTMLInputElement>(
      "input[type=file]",
    );

    const stub = vi.fn(
      async (): Promise<Response> =>
        new Response(new Blob(["remote"], { type: "application/pdf" }), {
          status: 200,
        }),
    );
    vi.stubGlobal("fetch", stub);

    try {
      const result = await executeAutofill([
        {
          spId: "cv",
          value: "",
          fileDownloadUrl: "https://cdn.example.test/a.pdf",
          fileDataUrl: "data:text/plain;base64,bG9jYWw=",
          fileName: "from-url.pdf",
        },
      ]);

      expect(stub).toHaveBeenCalledTimes(1);
      expect(result.appliedSpIds).toEqual(["cv"]);
      expect(
        await input?.files?.[0]?.text(),
      ).toBe("remote");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("fills hidden file inputs (display:none) used behind upload buttons", async () => {
    document.body.innerHTML =
      '<input type="file" data-searchparty-autofill-id="cv" style="display: none" />';
    const input = document.querySelector<HTMLInputElement>(
      "input[type=file]",
    );
    const dataUrl = "data:text/plain;base64,SGVsbG8=";

    const result = await executeAutofill([
      {
        spId: "cv",
        value: "",
        fileDataUrl: dataUrl,
        fileName: "test-resume.txt",
      },
    ]);

    expect(result.appliedSpIds).toEqual(["cv"]);
    expect(result.results[0]).toMatchObject({ spId: "cv", ok: true });
    expect(input?.files?.length).toBe(1);
  });

  it("still skips non-file controls that are not visible", async () => {
    document.body.innerHTML =
      '<input data-searchparty-autofill-id="x" style="display: none" />';

    const result = await executeAutofill([
      { spId: "x", value: "hello" },
    ]);

    expect(result.appliedSpIds).toEqual([]);
    expect(result.results[0]).toMatchObject({
      spId: "x",
      ok: false,
      reason: "Field is not visible.",
    });
  });

  it("reports verification failures without recording applied ids", async () => {
    document.body.innerHTML = `
      <select data-searchparty-autofill-id="country">
        <option value="">Choose one</option>
        <option value="US">United States</option>
      </select>
    `;

    const result = await executeAutofill([
      { spId: "country", value: "Atlantis" },
    ]);

    expect(result.appliedSpIds).toEqual([]);
    expect(result.results[0]).toMatchObject({
      spId: "country",
      ok: false,
    });
  });
});
