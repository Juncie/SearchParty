import { ZodError } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { markAccountOnboardingComplete } from '#/server/profiles'
import {
  getAuthenticatedUserId,
  unauthorizedResponse,
} from '#/server/authenticated-session'

function badRequestResponse(error: unknown) {
  const message =
    error instanceof ZodError
      ? error.issues.map((issue) => issue.message).join(', ')
      : error instanceof Error
        ? error.message
        : 'Invalid account onboarding request.'

  return Response.json({ message }, { status: 400 })
}

export const Route = createFileRoute('/api/account/onboarding')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request)
        if (!userId) return unauthorizedResponse()

        try {
          const body = await request.json()
          const updated = await markAccountOnboardingComplete(userId, body)
          return Response.json(updated)
        } catch (error) {
          return badRequestResponse(error)
        }
      },
    },
  },
})
