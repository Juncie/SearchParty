import { createFileRoute } from '@tanstack/react-router'

import { createHealthResponse } from '@searchparty/shared'

export const Route = createFileRoute('/api/health/')({
  server: {
    handlers: {
      GET: () => Response.json(createHealthResponse()),
    },
  },
})
