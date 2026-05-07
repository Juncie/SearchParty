import { createFileRoute } from '@tanstack/react-router'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { env } from '@/env'
import { trpcRouter } from '@/integrations/trpc/router'

function handler({ request }: { request: Request }) {
  const baseUrl = env.BASE_API_URL
  if (!baseUrl) {
    throw new Error('BASE_API_URL is not set')
  }
  return fetchRequestHandler({
    req: request,
    router: trpcRouter,
    endpoint: `${baseUrl}/api/trpc`,
  })
}

export const Route = createFileRoute('/api/trpc/$')({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
})

export type TRPCRouter = typeof trpcRouter
