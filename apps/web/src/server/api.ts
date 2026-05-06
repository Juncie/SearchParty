import { Hono } from 'hono'
import { createHealthResponse } from '@searchparty/shared'

export const api = new Hono().get('/api/health', (c) =>
  c.json(createHealthResponse())
)

export const hello = new Hono().get('/api/hello', (c) =>
  c.json({ message: 'Hello, World!' })
)
