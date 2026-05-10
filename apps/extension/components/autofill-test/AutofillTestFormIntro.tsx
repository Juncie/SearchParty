export function AutofillTestFormIntro() {
  return (
    <header className="mb-8 space-y-2">
      <p className="island-kicker">Search Party · Dev</p>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Generic job application
      </h1>
      <p className="max-w-2xl text-sm/relaxed text-muted-foreground">
        Use this page to exercise Scan / Apply from the extension autofill
        screen. Serve the built extension output over{" "}
        <span className="font-medium text-foreground">http://localhost</span>{" "}
        (see{" "}
        <code className="rounded border border-border bg-muted/50 px-1 py-0.5 text-xs">
          pnpm serve:test-form
        </code>
        ) so the autofill content script can run—Chrome does not inject it on{" "}
        <code className="rounded border border-border bg-muted/50 px-1 py-0.5 text-xs">
          chrome-extension://
        </code>{" "}
        documents.
      </p>
    </header>
  );
}
