import { ZodError } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import {
  getAuthenticatedSession,
  unauthorizedResponse,
} from '#/server/authenticated-session'
import {
  deleteCurrentUser,
  updateCurrentUserName,
} from '#/server/user-settings'

function badRequestResponse(error: unknown) {
  const message =
    error instanceof ZodError
      ? error.issues.map((issue) => issue.message).join(', ')
      : error instanceof Error
        ? error.message
        : 'Invalid user request.'

  return Response.json({ message }, { status: 400 })
}

export const Route = createFileRoute('/api/user/me')({
  server: {
    handlers: {
      PATCH: async ({ request }) => {
        const session = await getAuthenticatedSession(request)
        if (!session?.user.id) return unauthorizedResponse()

        try {
          const user = await updateCurrentUserName(
            session.user.id,
            await request.json(),
          )

          return Response.json({ user })
        } catch (error) {
          return badRequestResponse(error)
        }
      },
      DELETE: async ({ request }) => {
        const session = await getAuthenticatedSession(request)
        if (!session?.user.id) return unauthorizedResponse()

        const deleted = await deleteCurrentUser(session.user.id)
        if (!deleted) {
          return Response.json({ message: 'User not found.' }, { status: 404 })
        }

        return new Response(null, { status: 204 })
      },
    },
  },
})
