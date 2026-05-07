import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { Login } from "@/components/auth/Login";
import { SignUp } from "@/components/auth/SignUp";
import type { ExtensionSurface } from "@/components/AppRouter";
import type { AuthScreenMode } from "@/components/auth/auth-screen-mode";
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
      <main
        className={
          isSidePanel ? "shell shell-sidepanel" : "shell"
        }
      >
        <section className="grid w-full justify-items-center gap-3">
          <p className="island-kicker">Search Party</p>
          <p className="text-sm text-muted-foreground">
            Checking your session...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main
      className={
        isSidePanel
          ? "shell shell-sidepanel place-items-center"
          : "shell"
      }
    >
      <section className="grid w-full justify-items-center gap-5">
        <img
          src="/searchparty.svg"
          alt="SearchParty"
          className="h-14 w-14 rounded-2xl"
        />
        <div className="grid w-full justify-items-center gap-2 text-center">
          <p className="island-kicker">Search Party</p>
          <h1 className="display-title text-2xl">
            {heading}
          </h1>
          <p className="lede max-w-xs">{description}</p>
        </div>

        {mode === "login" ? (
          <div className="grid w-full justify-items-center gap-2">
            <Login
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
          <ForgotPassword
            onSubmit={() => {
              setServerError(null);
              setMode("login");
            }}
            setMode={(nextMode) => {
              setServerError(null);
              setMode(nextMode);
            }}
          />
        ) : null}

        {mode === "signUp" ? (
          <SignUp
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
        ) : null}
      </section>
    </main>
  );
}
