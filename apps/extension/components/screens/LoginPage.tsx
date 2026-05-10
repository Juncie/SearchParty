import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { LoginAuthPanels } from "@/components/auth/LoginAuthPanels";
import { LoginAuthRoot } from "@/components/auth/LoginAuthRoot";
import { LoginSessionSkeleton } from "@/components/auth/LoginSessionSkeleton";
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

  const setAuthMode = useCallback((next: AuthScreenMode) => {
    setServerError(null);
    setMode(next);
  }, []);

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
      <LoginAuthRoot isSidePanel={isSidePanel} phase="loading">
        <LoginSessionSkeleton />
      </LoginAuthRoot>
    );
  }

  return (
    <LoginAuthRoot isSidePanel={isSidePanel} phase="ready">
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

        <LoginAuthPanels
          density={density}
          mode={mode}
          setAuthMode={setAuthMode}
          serverError={serverError}
          isSubmitting={isSubmitting}
          onLoginSubmit={handleLoginSubmit}
          onSignUpSubmit={handleSignUpSubmit}
        />
      </div>
    </LoginAuthRoot>
  );
}
