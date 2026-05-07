import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { SetAuthScreenMode } from "@/components/auth/auth-screen-mode";

interface SignUpProps {
  onSubmit?: (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
  setMode: SetAuthScreenMode;
}

export function SignUp({ onSubmit, setMode }: SignUpProps) {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(
      formData.get("confirmPassword") ?? ""
    );

    onSubmit?.({
      fullName,
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <Card className="w-full max-w-sm border-border/80 bg-card/95">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Join SearchParty to save jobs and automate
          applications.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="grid gap-3"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-1.5">
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
              inputSize="lg"
            />
          </div>

          <div className="grid gap-1.5">
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
              inputSize="lg"
            />
          </div>

          <div className="grid gap-1.5">
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
              inputSize="lg"
            />
          </div>

          <div className="grid gap-1.5">
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
              inputSize="lg"
            />
          </div>

          <Button
            variant="default"
            type="submit"
            className="mt-1 w-full"
            size="lg"
          >
            Create account
          </Button>

          <Button
            type="button"
            variant="link"
            className="h-auto justify-start px-0 text-xs"
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
