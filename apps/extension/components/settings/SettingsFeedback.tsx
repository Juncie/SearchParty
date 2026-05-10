interface SettingsFeedbackProps {
  error: string | null;
  message: string | null;
}

export function SettingsFeedback({
  error,
  message,
}: SettingsFeedbackProps) {
  if (!error && !message) {
    return null;
  }

  return (
    <div className="@sm:col-span-2 @lg:col-span-6 space-y-2">
      {error ? (
        <p className="error-message text-destructive">{error}</p>
      ) : null}
      {message ? <p className="panel-muted">{message}</p> : null}
    </div>
  );
}
