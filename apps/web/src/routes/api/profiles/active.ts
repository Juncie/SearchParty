import { ZodError } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { setActiveApplicantProfile } from '#/server/profiles'
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
        : 'Invalid active profile request.'

  return Response.json({ message }, { status: 400 })
}

export const Route = createFileRoute('/api/profiles/active')({
  server: {
    handlers: {
      PUT: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request)
        if (!userId) return unauthorizedResponse()

        try {
          const result = await setActiveApplicantProfile(
            userId,
            await request.json(),
          )

          if (!result) {
            return Response.json({ message: 'Profile not found.' }, { status: 404 })
          }

          return Response.json(result)
        } catch (error) {
          return badRequestResponse(error)
        }
      },
    },
  },
})
