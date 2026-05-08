import { eq } from 'drizzle-orm'
import {
  currentUserSchema,
  updateCurrentUserInputSchema,
} from '@searchparty/shared'
import { user } from '@searchparty/db'
import { db } from '#/db'

export async function updateCurrentUserName(
  userId: string,
  rawInput: unknown,
) {
  const input = updateCurrentUserInputSchema.parse(rawInput)
  const [updatedUser] = await db
    .update(user)
    .set({
      name: input.name,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
    .returning()

  return currentUserSchema.parse(updatedUser)
}

export async function deleteCurrentUser(userId: string) {
  const [deletedUser] = await db
    .delete(user)
    .where(eq(user.id, userId))
    .returning({ id: user.id })

  return Boolean(deletedUser)
}
