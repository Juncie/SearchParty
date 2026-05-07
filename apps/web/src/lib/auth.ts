import { betterAuth, env } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  secret: env.BETTER_AUTH_SECRET ?? '',
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
})
