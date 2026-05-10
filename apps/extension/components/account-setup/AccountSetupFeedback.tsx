interface AccountSetupFeedbackProps {
  error: string | null;
  message: string | null;
}

export function AccountSetupFeedback({
  error,
  message,
}: AccountSetupFeedbackProps) {
  return (
    <>
      {error ? (
        <p className="error-message text-destructive">{error}</p>
      ) : null}
      {message ? <p className="panel-muted">{message}</p> : null}
    </>
  );
}
