import { and, desc, eq } from "drizzle-orm";
import { jobPostings } from "@searchparty/db";
import {
  jobExtractionInputSchema,
  jobPostingSchema,
  jobPostingsResponseSchema,
} from "@searchparty/shared";
import { db } from "#/db";

function createId() {
  return crypto.randomUUID();
}

function toIsoDate(value: Date | string) {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function mapJob(row: typeof jobPostings.$inferSelect) {
  return jobPostingSchema.parse({
    id: row.id,
    userId: row.userId,
    sourceUrl: row.sourceUrl,
    platform: row.platform,
    company: row.company,
    title: row.title,
    location: row.location,
    description: row.description,
    requirements: row.requirements,
    extractorVersion: row.extractorVersion,
    rawEvidence: row.rawEvidence,
    createdAt: toIsoDate(row.createdAt),
    updatedAt: toIsoDate(row.updatedAt),
  });
}

/** Saves a job extraction preview for the signed-in user. */
export async function createJobPosting(userId: string, body: unknown) {
  const input = jobExtractionInputSchema.parse(body);
  const id = createId();
  await db.insert(jobPostings).values({
    id,
    userId,
    sourceUrl: input.sourceUrl,
    platform: input.platform,
    company: input.company,
    title: input.title,
    location: input.location,
    description: input.description,
    requirements: input.requirements,
    extractorVersion: input.extractorVersion,
    rawEvidence: input.rawEvidence,
  });
  const rows = await db
    .select()
    .from(jobPostings)
    .where(and(eq(jobPostings.id, id), eq(jobPostings.userId, userId)))
    .limit(1);
  if (rows.length === 0) {
    throw new Error("Failed to load saved job posting.");
  }
  return mapJob(rows[0]);
}

export async function listJobPostingsForUser(userId: string) {
  const rows = await db
    .select()
    .from(jobPostings)
    .where(eq(jobPostings.userId, userId))
    .orderBy(desc(jobPostings.updatedAt));
  return jobPostingsResponseSchema.parse({ jobs: rows.map(mapJob) });
}

export async function getJobPostingForUser(userId: string, jobId: string) {
  const rows = await db
    .select()
    .from(jobPostings)
    .where(and(eq(jobPostings.id, jobId), eq(jobPostings.userId, userId)))
    .limit(1);
  if (rows.length === 0) {
    return null;
  }
  return mapJob(rows[0]);
}
