import { ZodError } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import {
  deleteApplicantProfile,
  updateApplicantProfile,
} from '#/server/profiles'
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
        : 'Invalid profile request.'

  return Response.json({ message }, { status: 400 })
}

export const Route = createFileRoute('/api/profiles/$profileId')({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const userId = await getAuthenticatedUserId(request)
        if (!userId) return unauthorizedResponse()

        try {
          const profile = await updateApplicantProfile(
            userId,
            params.profileId,
            await request.json(),
          )

          if (!profile) {
            return Response.json({ message: 'Profile not found.' }, { status: 404 })
          }

          return Response.json({ profile })
        } catch (error) {
          return badRequestResponse(error)
        }
      },
      DELETE: async ({ request, params }) => {
        const userId = await getAuthenticatedUserId(request)
        if (!userId) return unauthorizedResponse()

        const deleted = await deleteApplicantProfile(userId, params.profileId)
        if (!deleted) {
          return Response.json({ message: 'Profile not found.' }, { status: 404 })
        }

        return new Response(null, { status: 204 })
      },
    },
  },
})
