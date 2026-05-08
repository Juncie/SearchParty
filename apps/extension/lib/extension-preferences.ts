export type ExtensionThemePreference =
  | "light"
  | "dark"
  | "system";

export type ExtensionOpenBehavior = "popup" | "sidepanel";

export interface ExtensionPreferences {
  theme: ExtensionThemePreference;
  openBehavior: ExtensionOpenBehavior;
}

export const extensionPreferenceKeys = {
  theme: "searchPartyThemePreference",
  openBehavior: "searchPartyOpenBehavior",
} as const;

export const extensionPreferenceMessageType =
  "searchPartyPreferencesChanged";

const defaultPreferences: ExtensionPreferences = {
  theme: "system",
  openBehavior: "sidepanel",
};

export async function getExtensionPreferences(): Promise<ExtensionPreferences> {
  const stored = await browser.storage.local.get([
    extensionPreferenceKeys.theme,
    extensionPreferenceKeys.openBehavior,
  ]);

  return {
    theme: parseThemePreference(
      stored[extensionPreferenceKeys.theme]
    ),
    openBehavior: parseOpenBehavior(
      stored[extensionPreferenceKeys.openBehavior]
    ),
  };
}

export async function setThemePreference(
  theme: ExtensionThemePreference
) {
  await browser.storage.local.set({
    [extensionPreferenceKeys.theme]: theme,
  });
  applyThemePreference(theme);
}

export async function setOpenBehaviorPreference(
  openBehavior: ExtensionOpenBehavior
) {
  await browser.storage.local.set({
    [extensionPreferenceKeys.openBehavior]: openBehavior,
  });
  await notifyPreferenceChange();
}

export async function applyStoredTheme() {
  const { theme } = await getExtensionPreferences();
  applyThemePreference(theme);
}

export function applyThemePreference(
  theme: ExtensionThemePreference
) {
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const shouldUseDark =
    theme === "dark" || (theme === "system" && prefersDark);

  document.documentElement.classList.toggle(
    "dark",
    shouldUseDark
  );
}

export async function applyPanelOpenBehavior() {
  if (!browser.sidePanel?.setPanelBehavior) return;

  const { openBehavior } = await getExtensionPreferences();
  await browser.sidePanel.setPanelBehavior({
    openPanelOnActionClick: openBehavior === "sidepanel",
  });
}

function parseThemePreference(
  value: unknown
): ExtensionThemePreference {
  if (
    value === "light" ||
    value === "dark" ||
    value === "system"
  ) {
    return value;
  }

  return defaultPreferences.theme;
}

function parseOpenBehavior(
  value: unknown
): ExtensionOpenBehavior {
  if (value === "popup" || value === "sidepanel") {
    return value;
  }

  return defaultPreferences.openBehavior;
}

async function notifyPreferenceChange() {
  try {
    await browser.runtime.sendMessage({
      type: extensionPreferenceMessageType,
    });
  } catch {
    // The settings screen can still persist preferences if no listener is active.
  }
}
