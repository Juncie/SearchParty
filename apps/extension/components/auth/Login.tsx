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

interface LoginProps {
  onSubmit?: (payload: {
    email: string;
    password: string;
  }) => void;
  onForgotPassword?: () => void;
}

export function Login({
  onSubmit,
  onForgotPassword,
}: LoginProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setError(null);
    onSubmit?.({ email, password });
  };

  return (
    <Card className="w-full max-w-sm border-border/80 bg-card/95">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Use your SearchParty account credentials.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="grid gap-3"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid gap-1.5">
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
              aria-invalid={Boolean(error)}
              inputSize="lg"
            />
          </div>

          <div className="grid gap-1.5">
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
              aria-invalid={Boolean(error)}
              inputSize="lg"
            />
          </div>

          {error ? (
            <p className="text-xs text-destructive">{error}</p>
          ) : null}

          <Button type="submit" className="mt-1 w-full" size="lg">
            Login
          </Button>

          <Button
            type="button"
            variant="link"
            className="h-auto justify-start px-0 text-xs"
            onClick={onForgotPassword}
          >
            Forgot password?
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
