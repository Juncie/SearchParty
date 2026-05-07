import { createDb } from '@searchparty/db'
import { env } from '#/env'

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to initialize the database client')
}

export const db = createDb(env.DATABASE_URL)
