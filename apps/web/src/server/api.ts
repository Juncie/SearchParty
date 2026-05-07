import { Hono } from 'hono'
import { createHealthResponse } from '@searchparty/shared'

export const api = new Hono().get('/api/health', (c) =>
  c.json(createHealthResponse())
)