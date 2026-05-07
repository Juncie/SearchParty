import { createFileRoute } from '@tanstack/react-router'
import { auth, ensureAuthTablesReady } from '#/lib/auth'

async function handleAuthRequest(request: Request) {
  try {
    await ensureAuthTablesReady()
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Better Auth schema check failed.'
    console.warn(`[auth-startup-check] ${message}`)

    return Response.json(
      {
        code: 'AUTH_SCHEMA_NOT_READY',
        message,
      },
      { status: 503 }
    )
  }

  return auth.handler(request)
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => handleAuthRequest(request),
      POST: ({ request }) => handleAuthRequest(request),
    },
  },
})
