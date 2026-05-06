import {
  SEARCHPARTY_APP,
  healthResponseSchema,
  type HealthResponse,
} from "@searchparty/shared";

const webBaseUrlStorageKey = "searchPartyWebBaseUrl";

export async function getSearchPartyWebBaseUrl() {
  const stored = await browser.storage.local.get(webBaseUrlStorageKey);
  const configuredUrl = stored[webBaseUrlStorageKey];

  if (typeof configuredUrl === "string" && configuredUrl.trim()) {
    return configuredUrl.trim().replace(/\/$/, "");
  }

  return SEARCHPARTY_APP.webDevUrl;
}

export async function checkSearchPartyHealth(): Promise<HealthResponse> {
  const webBaseUrl = await getSearchPartyWebBaseUrl();
  const response = await fetch(`${webBaseUrl}/api/health`);

  if (!response.ok) {
    throw new Error(
      `SearchParty API returned ${response.status} ${response.statusText}`
    );
  }

  return healthResponseSchema.parse(await response.json());
}
