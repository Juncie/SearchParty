import { ZodError } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import {
  createApplicantProfile,
  listApplicantProfiles,
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

export const Route = createFileRoute('/api/profiles/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request)
        if (!userId) return unauthorizedResponse()

        return Response.json(await listApplicantProfiles(userId))
      },
      POST: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request)
        if (!userId) return unauthorizedResponse()

        try {
          const profile = await createApplicantProfile(userId, await request.json())
          return Response.json({ profile }, { status: 201 })
        } catch (error) {
          return badRequestResponse(error)
        }
      },
    },
  },
})
