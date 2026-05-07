import { createFileRoute } from '@tanstack/react-router'

import { addTodo, getTodos } from '#/server/todos-store'

export const Route = createFileRoute('/api/todos')({
  server: {
    handlers: {
      GET: () => Response.json({ todos: getTodos() }),
      POST: async ({ request }) => {
        const { name } = await request.json()
        return Response.json({ todos: addTodo(name) })
      }
    },
  },
})


