import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { Login } from "@/components/auth/Login";
import { SignUp } from "@/components/auth/SignUp";
import type { ExtensionSurface } from "@/components/AppRouter";
import { Button } from "@/components/ui/button";

interface LoginPageProps {
  surface: ExtensionSurface;
}

export function LoginPage({ surface }: LoginPageProps) {
  const navigate = useNavigate();
  const isSidePanel = surface === "sidepanel";
  const [mode, setMode] = useState<
    "login" | "forgotPassword" | "signUp"
  >("login");

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
            Welcome back
          </h1>
          <p className="lede max-w-xs">
            Sign in to continue managing your job search from
            the extension.
          </p>
        </div>

        {mode === "login" ? (
          <div className="grid w-full justify-items-center gap-2">
            <Login
              onSubmit={() => {
                void navigate({ to: "/dashboard" });
              }}
              onForgotPassword={() => {
                setMode("forgotPassword");
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full max-w-sm"
              onClick={() => {
                setMode("signUp");
              }}
            >
              Create account
            </Button>
          </div>
        ) : null}

        {mode === "forgotPassword" ? (
          <ForgotPassword
            onSubmit={() => {
              setMode("login");
            }}
            onBackToLogin={() => {
              setMode("login");
            }}
          />
        ) : null}

        {mode === "signUp" ? (
          <SignUp
            onSubmit={() => {
              void navigate({ to: "/dashboard" });
            }}
            onSignIn={() => {
              setMode("login");
            }}
          />
        ) : null}
      </section>
    </main>
  );
}
