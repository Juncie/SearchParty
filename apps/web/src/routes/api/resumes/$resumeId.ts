import { ZodError } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import {
  ResumeServiceError,
  deleteResumeForUser,
  finalizeResumeUpload,
  getResumeDownloadPayload,
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

export const Route = createFileRoute('/api/resumes/$resumeId')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const userId = await getAuthenticatedUserId(request)
        if (!userId) {
          return unauthorizedResponse(
            'You must be signed in to download resumes.',
          )
        }

        try {
          return Response.json(
            await getResumeDownloadPayload(userId, params.resumeId),
          )
        } catch (error) {
          const mapped = mapResumeError(error)
          if (mapped) {
            return mapped
          }
          throw error
        }
      },
      PATCH: async ({ request, params }) => {
        const userId = await getAuthenticatedUserId(request)
        if (!userId) {
          return unauthorizedResponse(
            'You must be signed in to finalize resume uploads.',
          )
        }

        try {
          const resume = await finalizeResumeUpload(
            userId,
            params.resumeId,
            await request.json(),
          )
          return Response.json({ resume })
        } catch (error) {
          const mapped = mapResumeError(error)
          if (mapped) {
            return mapped
          }
          return badRequestResponse(error)
        }
      },
      DELETE: async ({ request, params }) => {
        const userId = await getAuthenticatedUserId(request)
        if (!userId) {
          return unauthorizedResponse(
            'You must be signed in to delete resumes.',
          )
        }

        try {
          const deleted = await deleteResumeForUser(userId, params.resumeId)
          if (!deleted) {
            return Response.json({ message: 'Resume not found.' }, { status: 404 })
          }
          return new Response(null, { status: 204 })
        } catch (error) {
          const mapped = mapResumeError(error)
          if (mapped) {
            return mapped
          }
          throw error
        }
      },
    },
  },
})
