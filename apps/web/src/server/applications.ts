import { and, desc, eq } from "drizzle-orm";
import { applicationEvents, applications } from "@searchparty/db";
import {
  applicationInputSchema,
  applicationSchema,
  applicationUpdateSchema,
  applicationsResponseSchema,
  canTransitionApplicationStatus,
} from "@searchparty/shared";
import type { ApplicationStatus } from "@searchparty/shared";
import { db } from "#/db";

export class ApplicationServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApplicationServiceError";
  }
}

function createId() {
  return crypto.randomUUID();
}

function toIsoDate(value: Date | string) {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function mapApplication(row: typeof applications.$inferSelect) {
  return applicationSchema.parse({
    id: row.id,
    userId: row.userId,
    profileId: row.profileId,
    jobPostingId: row.jobPostingId,
    resumeId: row.resumeId,
    status: row.status,
    notes: row.notes,
    createdAt: toIsoDate(row.createdAt),
    updatedAt: toIsoDate(row.updatedAt),
  });
}

export async function listApplicationsForUser(userId: string) {
  const rows = await db
    .select()
    .from(applications)
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.updatedAt));
  return applicationsResponseSchema.parse({
    applications: rows.map(mapApplication),
  });
}

/**
 * Creates an application record. Filling fields never implies "applied" —
 * callers choose the status explicitly (default: saved).
 */
export async function createApplication(userId: string, body: unknown) {
  const input = applicationInputSchema.parse(body);
  const existing = await db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.userId, userId),
        eq(applications.jobPostingId, input.jobPostingId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    return mapApplication(existing[0]);
  }

  const id = createId();
  await db.insert(applications).values({
    id,
    userId,
    profileId: input.profileId ?? null,
    jobPostingId: input.jobPostingId,
    resumeId: input.resumeId ?? null,
    status: input.status,
    notes: input.notes,
  });
  await db.insert(applicationEvents).values({
    id: createId(),
    applicationId: id,
    fromStatus: "",
    toStatus: input.status,
    note: "Application created",
  });
  const rows = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);
  if (rows.length === 0) {
    throw new ApplicationServiceError("Failed to create application.", 500);
  }
  return mapApplication(rows[0]);
}

export async function updateApplication(
  userId: string,
  applicationId: string,
  body: unknown,
) {
  const input = applicationUpdateSchema.parse(body);
  const rows = await db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.id, applicationId),
        eq(applications.userId, userId),
      ),
    )
    .limit(1);

  if (rows.length === 0) {
    throw new ApplicationServiceError("Application not found.", 404);
  }
  const row = rows[0];

  if (input.status && input.status !== row.status) {
    if (
      !canTransitionApplicationStatus(
        row.status as ApplicationStatus,
        input.status,
      )
    ) {
      throw new ApplicationServiceError(
        `Cannot transition from ${row.status} to ${input.status}.`,
        400,
      );
    }
    await db.insert(applicationEvents).values({
      id: createId(),
      applicationId,
      fromStatus: row.status,
      toStatus: input.status,
      note: "",
    });
  }

  const updatedRows = await db
    .update(applications)
    .set({
      status: input.status ?? row.status,
      notes: input.notes ?? row.notes,
      profileId:
        input.profileId === undefined ? row.profileId : input.profileId,
      resumeId: input.resumeId === undefined ? row.resumeId : input.resumeId,
      updatedAt: new Date(),
    })
    .where(eq(applications.id, applicationId))
    .returning();

  if (updatedRows.length === 0) {
    throw new ApplicationServiceError("Application not found.", 404);
  }
  return mapApplication(updatedRows[0]);
}
