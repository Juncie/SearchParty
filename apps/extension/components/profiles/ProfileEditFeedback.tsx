interface ProfileEditFeedbackProps {
  error: string | null;
  message: string | null;
}

export function ProfileEditFeedback({
  error,
  message,
}: ProfileEditFeedbackProps) {
  return (
    <>
      {error ? (
        <p className="error-message text-destructive">{error}</p>
      ) : null}
      {message ? <p className="panel-muted">{message}</p> : null}
    </>
  );
}
