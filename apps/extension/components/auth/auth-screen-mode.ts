export type AuthScreenMode =
  | "login"
  | "forgotPassword"
  | "signUp";

export type SetAuthScreenMode = (
  mode: AuthScreenMode
) => void;
