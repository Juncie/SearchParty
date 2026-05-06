import { describe, expect, it } from 'vitest'
import { healthResponseSchema } from '@searchparty/shared'

import { api } from './api'

describe('api health endpoint', () => {
  it('returns the shared SearchParty health contract', async () => {
    const response = await api.request('/api/health')
    const body = healthResponseSchema.parse(await response.json())

    expect(response.status).toBe(200)
    expect(body.app).toBe('SearchParty')
    expect(body.status).toBe('ok')
  })
})
