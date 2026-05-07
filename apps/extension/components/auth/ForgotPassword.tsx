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

interface ForgotPasswordProps {
  onSubmit?: (payload: { email: string }) => void;
  setMode: SetAuthScreenMode;
}

export function ForgotPassword({
  onSubmit,
  setMode,
}: ForgotPasswordProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    onSubmit?.({ email });
  };

  return (
    <Card className="w-full max-w-sm border-border/80 bg-card/95">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>
          Enter your account email and we will send reset instructions.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <label
              htmlFor="forgot-password-email"
              className="text-xs font-medium text-muted-foreground"
            >
              Email
            </label>
            <Input
              id="forgot-password-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              inputSize="lg"
            />
          </div>

          <Button type="submit" className="mt-1 w-full" size="lg">
            Send reset link
          </Button>

          <Button
            type="button"
            variant="link"
            className="h-auto justify-start px-0 text-xs"
            onClick={() => {
              setMode("login");
            }}
          >
            Back to sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
