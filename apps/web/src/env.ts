import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.url().optional(),
    SERVER_URL: z.url().optional(),
    BASE_API_URL: z.url().optional(),
    BETTER_AUTH_URL: z.url().optional(),
    BETTER_AUTH_SECRET: z.string().min(16).optional(),
    BETTER_AUTH_TRUSTED_EXTENSION_ORIGINS: z.string().optional(),
    /** Cloudflare account id (R2 S3 endpoint). */
    R2_ACCOUNT_ID: z.string().min(1).optional(),
    R2_ACCESS_KEY_ID: z.string().min(1).optional(),
    /** R2 S3 API secret access key. */
    R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    /**
     * Legacy alias for `R2_SECRET_ACCESS_KEY` when only one “API token” value
     * is configured.
     */
    R2_API_TOKEN: z.string().min(1).optional(),
    R2_BUCKET_NAME: z.string().min(1).optional(),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'VITE_',

  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
})
