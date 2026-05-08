export type AuthScreenMode =
  | "login"
  | "forgotPassword"
  | "signUp";

/** Popup uses compact controls; side panel uses comfortable spacing. */
export type AuthDensity = "compact" | "comfortable";

export type SetAuthScreenMode = (
  mode: AuthScreenMode
) => void;
