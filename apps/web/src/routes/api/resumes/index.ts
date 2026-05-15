import { ZodError } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import {
  ResumeServiceError,
  createResumePresignedUpload,
  listResumesForUser,
} from '#/server/resumes'
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
        : 'Invalid resume request.'

  return Response.json({ message }, { status: 400 })
}

function mapResumeError(error: unknown) {
  if (error instanceof ResumeServiceError) {
    return Response.json({ message: error.message }, { status: error.status })
  }
  return null
}

export const Route = createFileRoute('/api/resumes/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request)
        if (!userId) {
          return unauthorizedResponse(
            'You must be signed in to list uploaded resumes.',
          )
        }

        try {
          return Response.json(await listResumesForUser(userId))
        } catch (error) {
          const mapped = mapResumeError(error)
          if (mapped) {
            return mapped
          }
          throw error
        }
      },
      POST: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request)
        if (!userId) {
          return unauthorizedResponse(
            'You must be signed in to upload resumes.',
          )
        }

        try {
          const payload = await createResumePresignedUpload(
            userId,
            await request.json(),
          )
          return Response.json(payload, { status: 201 })
        } catch (error) {
          const mapped = mapResumeError(error)
          if (mapped) {
            return mapped
          }
          return badRequestResponse(error)
        }
      },
    },
  },
})
