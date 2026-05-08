import { useState } from "react";

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

interface SignUpProps {
  density?: AuthDensity;
  onSubmit?: (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void> | void;
  isSubmitting?: boolean;
  serverError?: string | null;
  setMode: SetAuthScreenMode;
}

export function SignUp({
  density = "comfortable",
  onSubmit,
  isSubmitting = false,
  serverError = null,
  setMode,
}: SignUpProps) {
  const isCompact = density === "compact";
  const [validationError, setValidationError] = useState<
    string | null
  >(null);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fullName = String(
      formData.get("fullName") ?? ""
    ).trim();
    const email = String(
      formData.get("email") ?? ""
    ).trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(
      formData.get("confirmPassword") ?? ""
    );

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setValidationError("All fields are required.");
      return;
    }

    if (password.length < 8) {
      setValidationError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setValidationError(null);
    void onSubmit?.({
      fullName,
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <Card
      size={isCompact ? "sm" : "default"}
      className="w-full max-w-sm border-border/80 bg-card/95"
    >
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Join SearchParty to save jobs and automate
          applications.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className={cn("grid", isCompact ? "gap-2" : "gap-3")}
          onSubmit={handleSubmit}
          noValidate
        >
          <div
            className={cn(
              "grid",
              isCompact ? "gap-1" : "gap-1.5",
            )}
          >
            <label
              htmlFor="signup-full-name"
              className="text-xs font-medium text-muted-foreground"
            >
              Full name
            </label>
            <Input
              id="signup-full-name"
              name="fullName"
              autoComplete="name"
              placeholder="Jane Doe"
              required
              inputSize={isCompact ? "default" : "lg"}
              disabled={isSubmitting}
            />
          </div>

          <div
            className={cn(
              "grid",
              isCompact ? "gap-1" : "gap-1.5",
            )}
          >
            <label
              htmlFor="signup-email"
              className="text-xs font-medium text-muted-foreground"
            >
              Email
            </label>
            <Input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              inputSize={isCompact ? "default" : "lg"}
              disabled={isSubmitting}
            />
          </div>

          <div
            className={cn(
              "grid",
              isCompact ? "gap-1" : "gap-1.5",
            )}
          >
            <label
              htmlFor="signup-password"
              className="text-xs font-medium text-muted-foreground"
            >
              Password
            </label>
            <Input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              minLength={8}
              required
              inputSize={isCompact ? "default" : "lg"}
              disabled={isSubmitting}
            />
          </div>

          <div
            className={cn(
              "grid",
              isCompact ? "gap-1" : "gap-1.5",
            )}
          >
            <label
              htmlFor="signup-confirm-password"
              className="text-xs font-medium text-muted-foreground"
            >
              Confirm password
            </label>
            <Input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter password"
              minLength={8}
              required
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
            variant="default"
            type="submit"
            className={cn("w-full", !isCompact && "mt-1")}
            size={isCompact ? "default" : "lg"}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating account..."
              : "Create account"}
          </Button>

          <Button
            type="button"
            variant="link"
            className="h-auto justify-start px-0 text-xs"
            disabled={isSubmitting}
            onClick={() => {
              setMode("login");
            }}
          >
            Already have an account? Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
