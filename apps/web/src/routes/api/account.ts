import { ZodError } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { readAccountSetup, updateAccountSetup } from '#/server/profiles'
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
        : 'Invalid account setup request.'

  return Response.json({ message }, { status: 400 })
}

export const Route = createFileRoute('/api/account')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request)
        if (!userId) return unauthorizedResponse()

        return Response.json(await readAccountSetup(userId))
      },
      PUT: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request)
        if (!userId) return unauthorizedResponse()

        try {
          const body = await request.json()
          const updated = await updateAccountSetup(userId, body)
          return Response.json(updated)
        } catch (error) {
          return badRequestResponse(error)
        }
      },
    },
  },
})
