import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { Login } from "@/components/auth/Login";
import { SignUp } from "@/components/auth/SignUp";
import type {
  AuthDensity,
  AuthScreenMode,
} from "@/components/auth/auth-screen-mode";
import type { ExtensionSurface } from "@/components/extension-surface";
import {
  getAuthSession,
  signInWithEmail,
  signUpWithEmail,
} from "@/lib/searchparty-api";
import { cn } from "@/lib/utils";

interface LoginPageProps {
  surface: ExtensionSurface;
}

export function LoginPage({ surface }: LoginPageProps) {
  const navigate = useNavigate();
  const isSidePanel = surface === "sidepanel";
  const density: AuthDensity = isSidePanel
    ? "comfortable"
    : "compact";
  const [mode, setMode] = useState<AuthScreenMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] =
    useState(true);
  const [serverError, setServerError] = useState<
    string | null
  >(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentSession = await getAuthSession();
        if (currentSession?.session) {
          void navigate({ to: "/dashboard" });
        }
      } catch {
        // Ignore session check errors and allow user sign-in.
      } finally {
        setIsCheckingSession(false);
      }
    };

    void checkSession();
  }, [navigate]);

  const heading = useMemo(() => {
    if (mode === "signUp") {
      return "Create your account";
    }
    if (mode === "forgotPassword") {
      return "Reset your password";
    }

    return "Welcome Back";
  }, [mode]);

  const description = useMemo(() => {
    if (mode === "signUp") {
      return "Create your SearchParty account to save jobs and automate applications.";
    }
    if (mode === "forgotPassword") {
      return "Enter your account email and we'll send reset instructions.";
    }

    return "Sign in to continue managing your job search from the extension.";
  }, [mode]);

  const handleLoginSubmit = async (payload: {
    email: string;
    password: string;
  }) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await signInWithEmail(payload);
      void navigate({ to: "/dashboard" });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await signUpWithEmail({
        name: payload.fullName,
        email: payload.email,
        password: payload.password,
      });
      void navigate({ to: "/dashboard" });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div
        className={cn(
          "auth-layout-root",
          isSidePanel && "justify-center py-10",
        )}
      >
        <div
          className={cn(
            "flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-2 py-4",
          )}
        >
          <p className="island-kicker">Search Party</p>
          <p className="auth-session-check__hint">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "auth-layout-root",
        isSidePanel && "justify-center",
      )}
    >
      <div className="auth-layout">
        <img
          src="/searchparty.svg"
          alt="SearchParty"
          className="auth-layout__logo"
        />
        <div className="auth-layout__intro">
          <p className="island-kicker">Search Party</p>
          <h1 className="auth-layout__title">{heading}</h1>
          <p className="auth-layout__lede lede">{description}</p>
        </div>

        {mode === "login" ? (
          <div className="auth-layout__form-slot">
            <Login
              density={density}
              onSubmit={handleLoginSubmit}
              isSubmitting={isSubmitting}
              serverError={
                mode === "login" ? serverError : null
              }
              setMode={(nextMode) => {
                setServerError(null);
                setMode(nextMode);
              }}
            />
          </div>
        ) : null}

        {mode === "forgotPassword" ? (
          <div className="auth-layout__form-slot">
            <ForgotPassword
              density={density}
              onSubmit={() => {
                setServerError(null);
                setMode("login");
              }}
              setMode={(nextMode) => {
                setServerError(null);
                setMode(nextMode);
              }}
            />
          </div>
        ) : null}

        {mode === "signUp" ? (
          <div className="auth-layout__form-slot">
            <SignUp
              density={density}
              onSubmit={handleSignUpSubmit}
              isSubmitting={isSubmitting}
              serverError={
                mode === "signUp" ? serverError : null
              }
              setMode={(nextMode) => {
                setServerError(null);
                setMode(nextMode);
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
