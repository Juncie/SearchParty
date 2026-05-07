import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function CenteredShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="page-wrap rise-in flex min-h-[70vh] items-center justify-center py-10">
      <Card className="w-full max-w-xl">
        <CardHeader className="gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{subtitle}</CardDescription>
            </div>
            <div
              aria-hidden
              className="grid size-9 place-items-center rounded-lg border border-border bg-muted text-muted-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="M4.93 4.93l1.41 1.41" />
                <path d="M17.66 17.66l1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="M4.93 19.07l1.41-1.41" />
                <path d="M17.66 6.34l1.41-1.41" />
              </svg>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </div>
  )
}

export function RouterPending() {
  return (
    <CenteredShell
      title="Loading"
      subtitle="Fetching the latest state. This should be quick."
    >
      <div className="flex items-center gap-3">
        <div
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-primary"
        />
        <div className="text-xs/relaxed text-muted-foreground">
          If this takes longer than expected, try navigating back home.
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        <Button asChild variant="outline">
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </CenteredShell>
  )
}

export function RouterNotFound() {
  return (
    <CenteredShell
      title="Not found"
      subtitle="That route doesn’t exist (or was moved)."
    >
      <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
        <div className="font-heading text-lg font-semibold tracking-tight">
          404
        </div>
        <div className="text-xs/relaxed text-muted-foreground">
          Check the URL, or jump back to the dashboard.
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        <Button asChild>
          <Link to="/">Back to home</Link>
        </Button>
        <Button asChild variant="ghost">
          <a href={typeof window !== 'undefined' ? window.location.href : '/'}>
            Reload
          </a>
        </Button>
      </div>
    </CenteredShell>
  )
}

export function RouterError(props: { error: unknown; reset?: () => void }) {
  const message =
    props.error instanceof Error
      ? props.error.message
      : props.error
        ? String(props.error)
        : 'Unknown error'

  return (
    <div className="page-wrap rise-in flex min-h-[70vh] items-center justify-center py-10">
      <Card className="w-full max-w-xl">
        <CardHeader className="gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-base">Something broke</CardTitle>
              <CardDescription>
                The route failed to render. You can retry or go home.
              </CardDescription>
            </div>
            <div
              aria-hidden
              className="grid size-9 place-items-center rounded-lg border border-border bg-destructive/10 text-destructive"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.3 3.6 2.2 18a2 2 0 0 0 1.8 3h16a2 2 0 0 0 1.8-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
              </svg>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
            <div className="text-xs font-medium text-foreground">Error</div>
            <div className="mt-1 text-xs/relaxed text-muted-foreground">
              {message}
            </div>
          </div>
          {props.error instanceof Error && props.error.stack ? (
            <details className="rounded-lg border border-border bg-card px-3 py-2">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                Details
              </summary>
              <pre className="mt-2 overflow-auto text-[0.7rem]/relaxed text-muted-foreground">
                {props.error.stack}
              </pre>
            </details>
          ) : null}
        </CardContent>
        <div className="h-px bg-border" />
        <CardFooter className="flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/">Go home</Link>
            </Button>
            {props.reset ? (
              <Button variant="secondary" onClick={props.reset}>
                Retry
              </Button>
            ) : null}
          </div>
          <Button asChild variant="ghost">
            <a href={typeof window !== 'undefined' ? window.location.href : '/'}>
              Reload
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

