import * as React from 'react'

import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { accountSetupResponseSchema } from '@searchparty/shared'

import { Card, CardContent, CardFooter, CardHeader } from '#/components/ui/card'
import { ProfileSetupWizard } from '#/components/profile-setup/ProfileSetupWizard'
import { Button } from '#/components/ui/button'

import { authClient } from '#/lib/auth-client'

/** Shell blocks that mirror the onboarding card while session / account data hydrate. */
function ProfileSetupRouteSkeleton() {
  return (
    <main className="page-wrap pb-14 pt-8">
      <div className="rise-in mx-auto w-full max-w-xl">
        <Card className="@container/skeleton border-border shadow-lg">
          <CardHeader className="grid gap-3 border-border border-b [.border-b]:pb-6">
            <div className="bg-muted/60 h-2 w-full animate-pulse rounded-full" />
            <div className="grid gap-2">
              <div className="bg-muted/55 h-5 w-32 animate-pulse rounded-md" />
              <div className="bg-muted/40 h-14 w-full animate-pulse rounded-md" />
              <div className="bg-muted/25 h-16 w-full animate-pulse rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 pt-7">
            {[0, 1, 2].map((key) => (
              <div key={key} className="grid gap-2">
                <div className="bg-muted/50 h-5 w-2/3 max-w-sm animate-pulse rounded-md" />
                <div className="bg-muted/30 h-11 w-full animate-pulse rounded-[10px]" />
              </div>
            ))}
          </CardContent>
          <CardFooter className="gap-3 border-border border-t pt-8">
            <div className="bg-muted/40 h-8 w-28 animate-pulse rounded-md" />
            <div className="bg-muted/50 ms-auto h-8 w-36 animate-pulse rounded-md" />
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/profile/new')({
  pendingComponent: ProfileSetupRouteSkeleton,
  component: ProfileNewPage,
})

function ProfileNewPage() {
  const navigate = useNavigate()
  const { data: session, isPending: sessionPending } = authClient.useSession()

  React.useEffect(() => {
    if (!sessionPending && !session?.user.id) {
      void navigate({ replace: true, to: '/' })
    }
  }, [navigate, session, sessionPending])

  const {
    data: account,
    isPending: accountPending,
    isError,
  } = useQuery({
    enabled: Boolean(session?.user.id),
    queryKey: ['account-setup', 'profile-new'],
    queryFn: async () => {
      const response = await fetch('/api/account', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Unable to load account details.')
      }

      const body: unknown = await response.json()
      return accountSetupResponseSchema.parse(body)
    },
  })

  const showSkeleton =
    sessionPending || (Boolean(session?.user.id) && accountPending)

  if (isError) {
    return (
      <main className="page-wrap pb-14 pt-8">
        <div
          role="alert"
          className="rounded-2xl border border-destructive/40 bg-card p-6 text-card-foreground"
        >
          <p className="font-heading font-medium text-lg text-foreground tracking-tight normal-case">{`Couldn't load onboarding`}</p>
          <p className="mt-2 font-sans text-muted-foreground text-sm/normal">{`Reload the page or sign in again.`}</p>
          <Button
            type="button"
            variant="default"
            size="lg"
            className="mt-4 rounded-lg"
            onClick={() => {
              void globalThis.window.location.assign('/profile/new')
            }}
          >
            Try again
          </Button>
        </div>
      </main>
    )
  }

  if (showSkeleton || !session?.user.id) {
    return <ProfileSetupRouteSkeleton />
  }

  if (!account) {
    return <ProfileSetupRouteSkeleton />
  }

  const skipAccount = Boolean(account.accountOnboardingCompletedAt)

  const initialAnswers: Record<string, unknown> = {
    ...account.accountOnboardingAnswers,
    firstName: account.firstName,
    lastName: account.lastName,
    phone: account.phone,
  }

  return (
    <main className="page-wrap pb-14 pt-8">
      <div className="rise-in mx-auto w-full max-w-xl">
        <ProfileSetupWizard
          initialAnswers={initialAnswers}
          skipAccount={skipAccount}
        />
      </div>
    </main>
  )
}
