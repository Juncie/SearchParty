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

async function callAuthEndpoint<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const webBaseUrl = await getSearchPartyWebBaseUrl();
  const hasBody = init.body !== undefined && init.body !== null;

  const response = await fetch(`${webBaseUrl}/api/auth/${path}`, {
    credentials: "include",
    ...init,
    headers: hasBody
      ? {
          "content-type": "application/json",
          ...(init.headers ?? {}),
        }
      : init.headers,
  });

  if (!response.ok) {
    let message = "Authentication request failed.";

    try {
      const payload = (await response.json()) as AuthResponseError;
      message = payload.message ?? payload.error ?? message;
    } catch {
      // Fallback to status when response isn't JSON
      message = `${message} (${response.status})`;
    }

    throw new Error(message);
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

export async function getAuthSession() {
  return callAuthEndpoint<AuthSession | null>("get-session");
}

export async function signOut() {
  return callAuthEndpoint<void>("sign-out", {
    method: "POST",
    body: JSON.stringify({}),
  });
}
