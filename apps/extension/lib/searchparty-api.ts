import {
  SEARCHPARTY_APP,
  accountOnboardingInputSchema,
  accountSetupResponseSchema,
  accountSetupSchema,
  applicantProfileSchema,
  applicantProfilesResponseSchema,
  currentUserResponseSchema,
  healthResponseSchema,
  RESUME_UPLOAD_MAX_BYTES,
  resumeDownloadResponseSchema,
  resumeListResponseSchema,
  resumeAutofillFileName,
  inferResumeUploadMimeTypeForWizard,
  uploadResumeWithPresignedFlow,
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

/** Lists resume rows for the signed-in user (includes pending uploads). */
export async function listUploadedResumes() {
  return resumeListResponseSchema.parse(
    await callSearchPartyEndpoint<unknown>("/api/resumes/"),
  );
}

/**
 * Returns a short-lived presigned GET URL for file-input autofill. The content
 * script fetches the bytes (see {@link RESUME_AUTOFILL_MAX_BYTES} enforcement there).
 */
export async function fetchResumeDownloadPayloadForAutofill(
  resumeId: string,
  mimeType: string,
): Promise<{ downloadUrl: string; fileName: string }> {
  const { downloadUrl } = resumeDownloadResponseSchema.parse(
    await callSearchPartyEndpoint<unknown>(`/api/resumes/${resumeId}`),
  );

  return {
    downloadUrl,
    fileName: resumeAutofillFileName(mimeType),
  };
}

/** Stored in wizard answers after a successful résumé presign + finalize flow. */
export type WizardResumeUploadAnswer = {
  fileName: string;
  fileSize: number;
  mimeType: string;
  resumeId: string;
  uploadStatus: "ready";
};

/**
 * Uploads a wizard-selected résumé through SearchParty presigned storage so the
 * account has a `ready` row for file autofill.
 */
export async function uploadResumeFromWizardFile(
  file: File,
): Promise<WizardResumeUploadAnswer> {
  const mimeType = inferResumeUploadMimeTypeForWizard({
    name: file.name,
    mimeTypeFromBrowser: file.type,
  });
  if (!mimeType) {
    throw new Error(
      "Only PDF, .doc, and .docx files are supported for résumé upload.",
    );
  }
  if (file.size > RESUME_UPLOAD_MAX_BYTES) {
    throw new Error(
      `Résumé must be ${String(Math.floor(RESUME_UPLOAD_MAX_BYTES / (1024 * 1024)))}MB or smaller.`,
    );
  }

  const record = await uploadResumeWithPresignedFlow({
    blob: file,
    sizeBytes: file.size,
    fileName: file.name,
    mimeType,
    kind: "resume",
    http: {
      requestPresign: async (body) =>
        callSearchPartyEndpoint<unknown>("/api/resumes/", {
          method: "POST",
          body: JSON.stringify(body),
        }),
      putStorage: async ({ url, method, headers, body }) => {
        const h = new Headers();
        for (const [key, value] of Object.entries(headers)) {
          h.set(key, value);
        }
        const res = await fetch(url, {
          method,
          headers: h,
          body,
          mode: "cors",
          credentials: "omit",
        });
        if (!res.ok) {
          throw new Error(
            `Could not upload file to storage (${String(res.status)}). Try again.`,
          );
        }
      },
      requestFinalize: async (resumeId) =>
        callSearchPartyEndpoint<unknown>(`/api/resumes/${resumeId}`, {
          method: "PATCH",
          body: JSON.stringify({ finalizeUpload: true }),
        }),
    },
  });

  return {
    fileName: file.name,
    fileSize: file.size,
    mimeType,
    resumeId: record.id,
    uploadStatus: "ready",
  };
}
