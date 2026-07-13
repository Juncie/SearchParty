import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type {
  AuthDensity,
  SetAuthScreenMode,
} from "@/components/auth/auth-screen-mode";
import { cn } from "@/lib/utils";

interface LoginProps {
  density?: AuthDensity;
  onSubmit?: (payload: {
    email: string;
    password: string;
  }) => Promise<void> | void;
  isSubmitting?: boolean;
  serverError?: string | null;
  setMode: SetAuthScreenMode;
}

export function Login({
  density = "comfortable",
  onSubmit,
  isSubmitting = false,
  serverError = null,
  setMode,
}: LoginProps) {
  const isCompact = density === "compact";
  const [validationError, setValidationError] = useState<
    string | null
  >(null);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(
      formData.get("email") ?? ""
    ).trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setValidationError(
        "Email and password are required."
      );
      return;
    }

    setValidationError(null);
    void onSubmit?.({ email, password });
  };

  return (
    <Card
      size={isCompact ? "sm" : "default"}
      className="w-full max-w-sm border-border/80 bg-card/95"
    >
      <CardHeader>
        <CardTitle>
          <h1>Login</h1>
        </CardTitle>
        <CardDescription>
          Use your SearchParty account credentials.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className={cn(
            "grid",
            isCompact ? "gap-2" : "gap-3"
          )}
          onSubmit={handleSubmit}
          noValidate
        >
          <div
            className={cn(
              "grid",
              isCompact ? "gap-1" : "gap-1.5"
            )}
          >
            <label
              htmlFor="login-email"
              className="text-xs font-medium text-muted-foreground"
            >
              Email
            </label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(
                validationError || serverError
              )}
              inputSize={isCompact ? "default" : "lg"}
              disabled={isSubmitting}
            />
          </div>

          <div
            className={cn(
              "grid",
              isCompact ? "gap-1" : "gap-1.5"
            )}
          >
            <label
              htmlFor="login-password"
              className="text-xs font-medium text-muted-foreground"
            >
              Password
            </label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={Boolean(
                validationError || serverError
              )}
              inputSize={isCompact ? "default" : "lg"}
              disabled={isSubmitting}
            />
          </div>

          {validationError ? (
            <p className="text-xs text-destructive">
              {validationError}
            </p>
          ) : null}
          {serverError ? (
            <p className="text-xs text-destructive">
              {serverError}
            </p>
          ) : null}

          <Button
            type="submit"
            className={cn("w-full", !isCompact && "mt-1")}
            size={isCompact ? "default" : "lg"}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full max-w-sm"
            size={isCompact ? "default" : "lg"}
            disabled={isSubmitting}
            onClick={() => {
              setMode("signUp");
            }}
          >
            Create account
          </Button>

          <Button
            type="button"
            variant="link"
            className="h-auto justify-start px-0 text-xs"
            disabled={isSubmitting}
            onClick={() => {
              setMode("forgotPassword");
            }}
          >
            Forgot password?
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
