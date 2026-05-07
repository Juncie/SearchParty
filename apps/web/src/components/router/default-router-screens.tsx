import { Link, useRouter } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowLeft,
  FileSearch,
  Loader2,
  RefreshCcw,
} from 'lucide-react'
import { Button } from '#/components/ui/button'

export function RouterError({
  error,
  reset,
}: {
  error: any
  reset?: () => void
}) {
  const router = useRouter()
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-border/50 bg-card p-8 shadow-sm">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Application Error
          </h2>
          <p className="text-sm text-muted-foreground">
            {error?.message ||
              'An unexpected error occurred while loading this page.'}
          </p>
        </div>
        <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {reset ? (
            <Button
              variant="default"
              onClick={reset}
              className="w-full gap-2 sm:w-auto"
            >
              <RefreshCcw className="size-4" />
              Try again
            </Button>
          ) : null}
          <Button
            variant="outline"
            onClick={() => router.history.back()}
            className="w-full gap-2 sm:w-auto"
          >
            <ArrowLeft className="size-4" />
            Go back
          </Button>
        </div>
      </div>
    </div>
  )
}

export function RouterNotFound() {
  const router = useRouter()
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-border/50 bg-card p-8 shadow-sm">
        <div className="flex size-14 items-center justify-center rounded-full bg-white/5 text-muted-foreground">
          <FileSearch className="size-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Page Not Found
          </h2>
          <p className="text-sm text-muted-foreground">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => router.history.back()}
            className="w-full gap-2 sm:w-auto"
          >
            <ArrowLeft className="size-4" />
            Go back
          </Button>
          <Link to="/">
            <Button variant="default" className="w-full sm:w-auto">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export function RouterPending() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium tracking-tight animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  )
}
