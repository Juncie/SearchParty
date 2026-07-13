import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FactProposal } from '@searchparty/shared'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/proposals')({
  component: FactProposalsPage,
})

async function fetchProposals(): Promise<FactProposal[]> {
  const res = await fetch('/api/fact-proposals/?status=pending', {
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Could not load résumé proposals.')
  }
  const data = (await res.json()) as { proposals: FactProposal[] }
  return data.proposals
}

async function reviewProposal(
  proposalId: string,
  action: 'approve' | 'reject',
) {
  const res = await fetch(`/api/fact-proposals/${proposalId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action }),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string
    } | null
    throw new Error(body?.message ?? 'Could not review proposal.')
  }
}

/**
 * Review queue for résumé extraction proposals.
 * Approvals promote into profile tables; rejections never reach autofill.
 */
function FactProposalsPage() {
  const session = authClient.useSession()
  const queryClient = useQueryClient()
  const proposalsQuery = useQuery({
    queryKey: ['fact-proposals', 'pending'],
    queryFn: fetchProposals,
    enabled: Boolean(session.data?.session),
  })

  const reviewMutation = useMutation({
    mutationFn: ({
      proposalId,
      action,
    }: {
      proposalId: string
      action: 'approve' | 'reject'
    }) => reviewProposal(proposalId, action),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['fact-proposals'],
      })
    },
  })

  if (session.isPending) {
    return (
      <main className="page-wrap py-8">
        <div className="bg-muted/50 h-32 w-full max-w-2xl animate-pulse rounded-lg" />
      </main>
    )
  }

  if (!session.data?.session) {
    return (
      <main className="page-wrap py-8">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>
              Review résumé proposals after signing in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/profile/new"
              className="inline-flex h-7 cursor-pointer items-center rounded-md bg-primary px-2 text-xs font-medium text-primary-foreground"
            >
              Continue setup
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="page-wrap grid gap-4 py-8">
      <div>
        <p className="island-kicker">Résumé intelligence</p>
        <h1 className="font-heading text-2xl font-semibold">
          Review proposed facts
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          SearchParty never invents personal facts. Accept only what looks
          correct — rejected proposals never enter your profile or autofill.
        </p>
      </div>

      {proposalsQuery.isLoading ? (
        <div className="grid gap-3">
          <div className="bg-muted/50 h-24 animate-pulse rounded-lg" />
          <div className="bg-muted/40 h-24 animate-pulse rounded-lg" />
        </div>
      ) : null}

      {proposalsQuery.error ? (
        <p role="alert" className="text-sm text-destructive">
          {proposalsQuery.error.message}
        </p>
      ) : null}

      {(proposalsQuery.data ?? []).length === 0 && !proposalsQuery.isLoading ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            No pending proposals. Upload a résumé and run extraction to see
            suggestions here.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-3">
        {(proposalsQuery.data ?? []).map((proposal) => (
          <Card key={proposal.id}>
            <CardHeader>
              <CardTitle className="text-sm capitalize">
                {proposal.kind.replaceAll('_', ' ')}
              </CardTitle>
              <CardDescription>
                Confidence {Math.round(proposal.confidence * 100)}%
                {proposal.sourceSpan?.excerpt
                  ? ` · “${proposal.sourceSpan.excerpt}”`
                  : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <pre className="overflow-x-auto rounded-md bg-muted/40 p-3 text-xs">
                {JSON.stringify(proposal.payload, null, 2)}
              </pre>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="cursor-pointer"
                  disabled={reviewMutation.isPending}
                  onClick={() =>
                    reviewMutation.mutate({
                      proposalId: proposal.id,
                      action: 'approve',
                    })
                  }
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  disabled={reviewMutation.isPending}
                  onClick={() =>
                    reviewMutation.mutate({
                      proposalId: proposal.id,
                      action: 'reject',
                    })
                  }
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
