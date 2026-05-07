import { betterAuth, env } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { sql } from 'drizzle-orm'
import { db } from '#/db'

type AuthTableName = 'user' | 'session' | 'account' | 'verification'

interface AuthTableCheckResult {
  userTable: string | null
  sessionTable: string | null
  accountTable: string | null
  verificationTable: string | null
}

let authTablesCheckPromise: Promise<void> | null = null

export function ensureAuthTablesReady() {
  if (!authTablesCheckPromise) {
    authTablesCheckPromise = (async () => {
      const result = await db.execute(sql<AuthTableCheckResult>`
        select
          to_regclass('public.user') as "userTable",
          to_regclass('public.session') as "sessionTable",
          to_regclass('public.account') as "accountTable",
          to_regclass('public.verification') as "verificationTable"
      `)

      const row = result.rows[0]
      const missingTables: AuthTableName[] = []
      if (!row?.userTable) missingTables.push('user')
      if (!row?.sessionTable) missingTables.push('session')
      if (!row?.accountTable) missingTables.push('account')
      if (!row?.verificationTable) missingTables.push('verification')

      if (missingTables.length > 0) {
        throw new Error(
          `Better Auth schema is not ready. Missing tables: ${missingTables.join(', ')}. Run "pnpm --filter web db:migrate" (or "pnpm --filter web db:push") and restart the web app.`
        )
      }
    })()
  }

  return authTablesCheckPromise
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  baseURL: env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  secret: env.BETTER_AUTH_SECRET ?? '',
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
  "chrome-extension://edbcjfjjdnagdeomigphpocbffcfifkc",
],
  plugins: [tanstackStartCookies()],
})
