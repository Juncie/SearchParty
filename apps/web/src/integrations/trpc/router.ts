import { z } from 'zod'

import { addTodo, getTodos } from '#/server/todos-store'

import { createTRPCRouter, publicProcedure } from './init'

import type { TRPCRouterRecord } from '@trpc/server'

const todosRouter = {
  list: publicProcedure.query(() => getTodos()),
  add: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => addTodo(input.name)),
} satisfies TRPCRouterRecord

export const trpcRouter = createTRPCRouter({
  todos: todosRouter,
})
export type TRPCRouter = typeof trpcRouter
