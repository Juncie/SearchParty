import { and, desc, eq } from "drizzle-orm";
import {
  generatedDocuments,
  generationRuns,
  jobPostings,
} from "@searchparty/db";
import {
  GENERATION_PROMPT_VERSION,
  approveGeneratedDocumentInputSchema,
  assertNoInventedEntities,
  buildEvidenceBoundDraft,
  generateDocumentInputSchema,
  generatedDocumentSchema,
} from "@searchparty/shared";
import { db } from "#/db";

export class GenerationServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "GenerationServiceError";
  }
}

function createId() {
  return crypto.randomUUID();
}

function toIsoDate(value: Date | string | null | undefined) {
  if (!value) {
    return null;
  }
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function mapDoc(row: typeof generatedDocuments.$inferSelect) {
  return generatedDocumentSchema.parse({
    id: row.id,
    userId: row.userId,
    profileId: row.profileId,
    jobPostingId: row.jobPostingId,
    kind: row.kind,
    content: row.content,
    status: row.status,
    evidenceJson: row.evidenceJson,
    model: row.model,
    promptVersion: row.promptVersion,
    createdAt: toIsoDate(row.createdAt),
    updatedAt: toIsoDate(row.updatedAt),
    approvedAt: toIsoDate(row.approvedAt),
  });
}

/**
 * Creates an evidence-bound draft. Uses confirmed evidence only; never invents
 * employers, schools, or credentials beyond the supplied evidence list.
 */
export async function generateDocumentDraft(userId: string, body: unknown) {
  const input = generateDocumentInputSchema.parse(body);
  const jobRows = await db
    .select()
    .from(jobPostings)
    .where(
      and(
        eq(jobPostings.id, input.jobPostingId),
        eq(jobPostings.userId, userId),
      ),
    )
    .limit(1);

  if (jobRows.length === 0) {
    throw new GenerationServiceError("Job posting not found.", 404);
  }
  const job = jobRows[0];

  const content = buildEvidenceBoundDraft({
    kind: input.kind,
    company: job.company,
    title: job.title,
    tone: input.tone,
    evidence: input.evidence,
    question: input.question,
  });

  const guard = assertNoInventedEntities({
    content,
    evidenceValues: input.evidence.map((item) => item.value),
    bannedTokens: [],
  });
  if (!guard.ok) {
    throw new GenerationServiceError(guard.reason, 400);
  }

  const id = createId();
  await db.insert(generatedDocuments).values({
    id,
    userId,
    profileId: input.profileId,
    jobPostingId: input.jobPostingId,
    kind: input.kind,
    content,
    status: "draft",
    evidenceJson: {
      factIds: input.evidence.map((item) => item.id),
      notes: "Deterministic evidence-bound draft",
    },
    model: "searchparty-deterministic",
    promptVersion: GENERATION_PROMPT_VERSION,
  });

  await db.insert(generationRuns).values({
    id: createId(),
    userId,
    generatedDocumentId: id,
    model: "searchparty-deterministic",
    promptVersion: GENERATION_PROMPT_VERSION,
    inputFactIds: input.evidence.map((item) => item.id),
  });

  const rows = await db
    .select()
    .from(generatedDocuments)
    .where(eq(generatedDocuments.id, id))
    .limit(1);
  if (rows.length === 0) {
    throw new GenerationServiceError("Failed to store generated document.", 500);
  }
  return mapDoc(rows[0]);
}

export async function listGeneratedDocumentsForUser(userId: string) {
  const rows = await db
    .select()
    .from(generatedDocuments)
    .where(eq(generatedDocuments.userId, userId))
    .orderBy(desc(generatedDocuments.updatedAt));
  return { documents: rows.map(mapDoc) };
}

export async function reviewGeneratedDocument(
  userId: string,
  documentId: string,
  body: unknown,
) {
  const input = approveGeneratedDocumentInputSchema.parse(body);
  const rows = await db
    .select()
    .from(generatedDocuments)
    .where(
      and(
        eq(generatedDocuments.id, documentId),
        eq(generatedDocuments.userId, userId),
      ),
    )
    .limit(1);

  if (rows.length === 0) {
    throw new GenerationServiceError("Document not found.", 404);
  }
  const row = rows[0];

  if (input.action === "reject") {
    const updatedRows = await db
      .update(generatedDocuments)
      .set({ status: "rejected", updatedAt: new Date() })
      .where(eq(generatedDocuments.id, documentId))
      .returning();
    if (updatedRows.length === 0) {
      throw new GenerationServiceError("Document not found.", 404);
    }
    return mapDoc(updatedRows[0]);
  }

  const content = input.content?.trim() || row.content;
  const updatedRows = await db
    .update(generatedDocuments)
    .set({
      content,
      status: "confirmed",
      approvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(generatedDocuments.id, documentId))
    .returning();
  if (updatedRows.length === 0) {
    throw new GenerationServiceError("Document not found.", 404);
  }
  return mapDoc(updatedRows[0]);
}
