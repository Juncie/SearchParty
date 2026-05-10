import type {
  AuthDensity,
  AuthScreenMode,
} from "@/components/auth/auth-screen-mode";

import { ForgotPassword } from "./ForgotPassword";
import { Login } from "./Login";
import { SignUp } from "./SignUp";

interface LoginAuthPanelsProps {
  /**
   * The density of the auth panels.
   *
   * @default "comfortable"
   */
  density: AuthDensity;
  mode: AuthScreenMode;
  /**
   * The visible auth mode.
   *
   * @default "login"
   */
  /** Clears server errors and updates the visible auth mode (from the page). */
  setAuthMode: (next: AuthScreenMode) => void;
  serverError: string | null;
  isSubmitting: boolean;
  onLoginSubmit: (payload: {
    email: string;
    password: string;
  }) => void | Promise<void>;
  onSignUpSubmit: (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void | Promise<void>;
}

export function LoginAuthPanels({
  density,
  mode,
  setAuthMode,
  serverError,
  isSubmitting,
  onLoginSubmit,
  onSignUpSubmit,
}: LoginAuthPanelsProps) {
  return (
    <>
      {mode === "login" ? (
        <div className="auth-layout__form-slot">
          <Login
            density={density}
            onSubmit={onLoginSubmit}
            isSubmitting={isSubmitting}
            serverError={
              mode === "login" ? serverError : null
            }
            setMode={setAuthMode}
          />
        </div>
      ) : null}

      {mode === "forgotPassword" ? (
        <div className="auth-layout__form-slot">
          <ForgotPassword
            density={density}
            onSubmit={() => {
              setAuthMode("login");
            }}
            setMode={setAuthMode}
          />
        </div>
      ) : null}

      {mode === "signUp" ? (
        <div className="auth-layout__form-slot">
          <SignUp
            density={density}
            onSubmit={onSignUpSubmit}
            isSubmitting={isSubmitting}
            serverError={
              mode === "signUp" ? serverError : null
            }
            setMode={setAuthMode}
          />
        </div>
      ) : null}
    </>
  );
}
