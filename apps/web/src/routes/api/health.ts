import { createFileRoute } from '@tanstack/react-router'

import { api } from '#/server/api'

function handler({ request }: { request: Request }) {
  return api.fetch(request)
}

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: handler,
    },
  },
})
