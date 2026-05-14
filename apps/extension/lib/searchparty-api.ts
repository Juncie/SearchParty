import {
  SEARCHPARTY_APP,
  accountOnboardingInputSchema,
  accountSetupResponseSchema,
  accountSetupSchema,
  applicantProfileSchema,
  applicantProfilesResponseSchema,
  currentUserResponseSchema,
  healthResponseSchema,
  type AccountOnboardingInput,
  type AccountSetup,
  type AccountSetupResponse,
  type ApplicantProfileInput,
  type ApplicantProfileUpdate,
  type ApplicantProfilesResponse,
  type CurrentUserResponse,
  type HealthResponse,
  type UpdateCurrentUserInput,
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
  let response: Response;

  try {
    response = await fetch(`${webBaseUrl}/api/health`);
  } catch {
    throw new Error(
      `Unable to reach SearchParty web app at ${webBaseUrl}.`
    );
  }

  if (!response.ok) {
    throw new Error(
      `SearchParty API returned ${response.status} ${response.statusText}`
    );
  }

  return healthResponseSchema.parse(await response.json());
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

export interface AuthSession {
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: string;
  };
  user: AuthUser;
}

interface AuthResponseError {
  message?: string;
  error?: string;
}

function formatAuthErrorMessage(
  message: string,
  webBaseUrl: string
) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid origin")) {
    return "Extension origin is not trusted by SearchParty auth. Update BETTER_AUTH_TRUSTED_EXTENSION_ORIGINS in web env and restart the web app.";
  }

  if (normalized.includes("auth_schema_not_ready")) {
    return "SearchParty auth database schema is not ready. Run `pnpm --filter web db:migrate` and restart the web app.";
  }

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("networkerror")
  ) {
    return `Unable to reach SearchParty web app at ${webBaseUrl}. Make sure the web app is running and extension host permissions include this URL.`;
  }

  return message;
}

async function callAuthEndpoint<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const webBaseUrl = await getSearchPartyWebBaseUrl();
  const hasBody = init.body !== undefined && init.body !== null;
  let response: Response;

  try {
    response = await fetch(`${webBaseUrl}/api/auth/${path}`, {
      credentials: "include",
      ...init,
      headers: hasBody
        ? {
          "content-type": "application/json",
          ...(init.headers ?? {}),
        }
        : init.headers,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to reach auth endpoint.";
    throw new Error(
      formatAuthErrorMessage(message, webBaseUrl)
    );
  }

  if (!response.ok) {
    let message = `Authentication request failed (${response.status}).`;

    try {
      const payload = (await response.json()) as AuthResponseError;
      message =
        payload.message ??
        payload.error ??
        (typeof (payload as { code?: string }).code === "string"
          ? (payload as { code: string }).code
          : message);
    } catch {
      // Fallback to status when response isn't JSON
      message = `${message} ${response.statusText}`.trim();
    }

    throw new Error(
      formatAuthErrorMessage(message, webBaseUrl)
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function signUpWithEmail(payload: {
  name: string;
  email: string;
  password: string;
}) {
  return callAuthEndpoint<AuthSession>("sign-up/email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function signInWithEmail(payload: {
  email: string;
  password: string;
}) {
  return callAuthEndpoint<AuthSession>("sign-in/email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAccountSetup(): Promise<AccountSetup> {
  const data = await callSearchPartyEndpoint("/api/account", { method: "GET" });
  return accountSetupSchema.parse(data);
}

/**
 * Fetches `/api/account` and validates with the extended schema that includes
 * `accountOnboardingCompletedAt` so the wizard can skip eligibility on return visits.
 */
export async function getAccountSetupResponse(): Promise<AccountSetupResponse> {
  const data = await callSearchPartyEndpoint("/api/account", { method: "GET" });
  return accountSetupResponseSchema.parse(data);
}

export async function updateAccountSetup(
  setup: AccountSetup
): Promise<AccountSetup> {
  const data = await callSearchPartyEndpoint("/api/account", {
    method: "PUT",
    body: JSON.stringify(setup),
  });
  return accountSetupSchema.parse(data);
}

/**
 * Persists account-level onboarding answers and marks eligibility complete.
 */
export async function markAccountOnboardingComplete(
  input: AccountOnboardingInput
): Promise<AccountSetupResponse> {
  const payload = accountOnboardingInputSchema.parse(input);
  const data = await callSearchPartyEndpoint("/api/account/onboarding", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return accountSetupResponseSchema.parse(data);
}

export async function getAuthSession() {
  return callAuthEndpoint<AuthSession | null>("get-session");
}

export async function signOut() {
  return callAuthEndpoint<void>("sign-out", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

interface ApiResponseError {
  message?: string;
  error?: string;
}

async function callSearchPartyEndpoint<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const webBaseUrl = await getSearchPartyWebBaseUrl();
  const hasBody = init.body !== undefined && init.body !== null;
  let response: Response;

  try {
    response = await fetch(`${webBaseUrl}${path}`, {
      credentials: "include",
      ...init,
      headers: hasBody
        ? {
          "content-type": "application/json",
          ...(init.headers ?? {}),
        }
        : init.headers,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to reach SearchParty API.";
    throw new Error(formatAuthErrorMessage(message, webBaseUrl));
  }

  if (!response.ok) {
    let message = `SearchParty API request failed (${response.status}).`;

    try {
      const payload = (await response.json()) as ApiResponseError;
      message = payload.message ?? payload.error ?? message;
    } catch {
      message = `${message} ${response.statusText}`.trim();
    }

    throw new Error(formatAuthErrorMessage(message, webBaseUrl));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function listApplicantProfiles(): Promise<ApplicantProfilesResponse> {
  return applicantProfilesResponseSchema.parse(
    await callSearchPartyEndpoint<unknown>("/api/profiles/")
  );
}

export async function createApplicantProfile(input: ApplicantProfileInput) {
  const payload = await callSearchPartyEndpoint<unknown>("/api/profiles/", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return applicantProfileSchema.parse(
    (payload as { profile?: unknown }).profile
  );
}

export async function updateApplicantProfile(
  profileId: string,
  input: ApplicantProfileUpdate
) {
  const payload = await callSearchPartyEndpoint<unknown>(
    `/api/profiles/${profileId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    }
  );

  return applicantProfileSchema.parse(
    (payload as { profile?: unknown }).profile
  );
}

export async function deleteApplicantProfile(profileId: string) {
  return callSearchPartyEndpoint<void>(`/api/profiles/${profileId}`, {
    method: "DELETE",
  });
}

export async function setActiveApplicantProfile(profileId: string | null) {
  return applicantProfilesResponseSchema.parse(
    await callSearchPartyEndpoint<unknown>("/api/profiles/active", {
      method: "PUT",
      body: JSON.stringify({ profileId }),
    })
  );
}

export async function updateCurrentUser(
  input: UpdateCurrentUserInput
): Promise<CurrentUserResponse> {
  return currentUserResponseSchema.parse(
    await callSearchPartyEndpoint<unknown>("/api/user/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    })
  );
}

export async function deleteCurrentUserAccount() {
  return callSearchPartyEndpoint<void>("/api/user/me", {
    method: "DELETE",
  });
}
