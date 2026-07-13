import {
  JOB_EXTRACTOR_VERSION,
  type JobExtractionInput,
  type JobPlatform,
} from "@searchparty/shared";

type ExtractedJob = Omit<JobExtractionInput, "rawEvidence"> & {
  rawEvidence: Record<string, unknown>;
};

function metaContent(selector: string): string {
  const el = document.querySelector(selector);
  if (el instanceof HTMLMetaElement) {
    return el.content.trim();
  }
  return (el?.textContent ?? "").trim();
}

function firstText(selectors: string[]): string {
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    const text = (el?.textContent ?? "").trim();
    if (text) {
      return text;
    }
  }
  return "";
}

function detectPlatform(url: string): JobPlatform {
  const host = (() => {
    try {
      return new URL(url).hostname.toLowerCase();
    } catch {
      return "";
    }
  })();
  if (host.includes("greenhouse") || host.includes("boards.greenhouse")) {
    return "greenhouse";
  }
  if (host.includes("lever.co")) {
    return "lever";
  }
  if (host.includes("ashbyhq.com") || host.includes("jobs.ashby")) {
    return "ashby";
  }
  return "generic";
}

function readJsonLdJobs(): Partial<ExtractedJob> {
  const scripts = Array.from(
    document.querySelectorAll('script[type="application/ld+json"]'),
  );
  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent ?? "") as
        | Record<string, unknown>
        | Array<Record<string, unknown>>;
      const nodes = Array.isArray(data) ? data : [data];
      for (const node of nodes) {
        const type = String(node["@type"] ?? "");
        if (!type.toLowerCase().includes("jobposting")) {
          continue;
        }
        const hiringOrg = node.hiringOrganization as
          | { name?: string }
          | undefined;
        const location = node.jobLocation as
          | { address?: { addressLocality?: string; addressRegion?: string } }
          | undefined;
        const locality = location?.address?.addressLocality ?? "";
        const region = location?.address?.addressRegion ?? "";
        return {
          title: String(node.title ?? ""),
          company: String(hiringOrg?.name ?? ""),
          description: String(node.description ?? "").replace(/<[^>]+>/g, " "),
          location: [locality, region].filter(Boolean).join(", "),
          rawEvidence: { jsonLd: node },
        };
      }
    } catch {
      // Ignore invalid JSON-LD blocks.
    }
  }
  return {};
}

/**
 * Deterministic job page extraction for Greenhouse, Lever, Ashby, and generic
 * fallback. Prefers JSON-LD / known selectors; never invents missing fields.
 */
export function extractJobFromDocument(
  sourceUrl = window.location.href,
): ExtractedJob {
  const platform = detectPlatform(sourceUrl);
  const jsonLd = readJsonLdJobs();

  const title =
    jsonLd.title ||
    firstText([
      "h1",
      "[data-qa='job-title']",
      ".posting-headline h2",
      ".job-title",
      "meta[property='og:title']",
    ]) ||
    metaContent("meta[property='og:title']");

  const company =
    jsonLd.company ||
    firstText([
      "[data-qa='company-name']",
      ".company-name",
      ".posting-category",
      "meta[property='og:site_name']",
    ]) ||
    metaContent("meta[property='og:site_name']");

  const location =
    jsonLd.location ||
    firstText([
      "[data-qa='job-location']",
      ".location",
      ".posting-categories .location",
      ".job-location",
    ]);

  const description =
    jsonLd.description ||
    firstText([
      "[data-qa='job-description']",
      "#content",
      ".job-description",
      ".posting-page",
      "main",
    ]).slice(0, 12_000);

  return {
    sourceUrl,
    platform,
    company,
    title,
    location,
    description,
    requirements: "",
    extractorVersion: JOB_EXTRACTOR_VERSION,
    rawEvidence: {
      platform,
      ...(jsonLd.rawEvidence ?? {}),
      titleSelectorHit: Boolean(title),
      companySelectorHit: Boolean(company),
    },
  };
}
