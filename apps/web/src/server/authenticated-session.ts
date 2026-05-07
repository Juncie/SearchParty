import { auth, ensureAuthTablesReady } from '#/lib/auth'

export async function getAuthenticatedUserId(request: Request) {
  await ensureAuthTablesReady()

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  return session?.user.id ?? null
}

export function unauthorizedResponse() {
  return Response.json(
    { message: 'You must be signed in to manage applicant profiles.' },
    { status: 401 },
  )
}
