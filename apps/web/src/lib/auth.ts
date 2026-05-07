import { betterAuth, env } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { sql } from 'drizzle-orm'
import { SEARCHPARTY_APP } from '@searchparty/shared'
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
      if (result.rows.length === 0) {
        throw new Error('Better Auth schema is not ready. No rows returned.')
      }
      const row = result.rows[0]
      const missingTables: AuthTableName[] = []
        if (!row.userTable) missingTables.push('user')
        if (!row.sessionTable) missingTables.push('session')
        if (!row.accountTable) missingTables.push('account')
        if (!row.verificationTable) missingTables.push('verification')
      if (missingTables.length > 0) {
        throw new Error(
          `Better Auth schema is not ready. Missing tables: ${missingTables.join(', ')}. Run "pnpm --filter web db:migrate" (or "pnpm --filter web db:push") and restart the web app.`
        )
      }
    })()
  }

  return authTablesCheckPromise
}

function getTrustedOrigins() {
  const defaultDevExtensionOrigins = [
    'chrome-extension://edbcjfjjdnagdeomigphpocbffcfifkc',
  ]

  const extensionOrigins = (
    process.env.BETTER_AUTH_TRUSTED_EXTENSION_ORIGINS ?? ''
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return [
    SEARCHPARTY_APP.webDevUrl,
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    ...defaultDevExtensionOrigins,
    ...extensionOrigins,
  ]
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  baseURL: env.BETTER_AUTH_URL ?? SEARCHPARTY_APP.webDevUrl,
  secret: env.BETTER_AUTH_SECRET ?? '',
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: getTrustedOrigins(),
  plugins: [tanstackStartCookies()],
})
