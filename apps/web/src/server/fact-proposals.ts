import { and, desc, eq } from "drizzle-orm";
import {
  applicantProfiles,
  documentExtractions,
  factProposals,
  profileEducation,
  profileSkills,
  resumes,
  userProfileSettings,
  workExperiences,
} from "@searchparty/db";
import {
  EXTRACTOR_VERSION,
  extractResumeProposalsFromText,
  factProposalListResponseSchema,
  factProposalSchema,
  reviewFactProposalInputSchema,
} from "@searchparty/shared";
import type { ResumeExtractionResult } from "@searchparty/shared";
import { db } from "#/db";
import { ResumeServiceError } from "#/server/resumes";

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

function mapProposalRow(row: typeof factProposals.$inferSelect) {
  return factProposalSchema.parse({
    id: row.id,
    userId: row.userId,
    profileId: row.profileId,
    resumeId: row.resumeId,
    kind: row.kind,
    status: row.status,
    confidence: Number(row.confidence),
    payload: row.payload,
    sourceSpan: row.sourceSpan,
    createdAt: toIsoDate(row.createdAt),
    updatedAt: toIsoDate(row.updatedAt),
    reviewedAt: toIsoDate(row.reviewedAt),
  });
}

/**
 * Persists pending fact proposals from a schema-constrained extraction result.
 * Never writes canonical profile rows — approval is required.
 */
export async function persistExtractionProposals(input: {
  userId: string;
  resumeId: string;
  profileId?: string | null;
  extractedText: string;
  result: ResumeExtractionResult;
}) {
  const extractionId = createId();
  await db.insert(documentExtractions).values({
    id: extractionId,
    resumeId: input.resumeId,
    userId: input.userId,
    status: "ready",
    extractorVersion: EXTRACTOR_VERSION,
    extractedText: input.extractedText.slice(0, 50_000),
    errorMessage: "",
  });

  const rows: (typeof factProposals.$inferInsert)[] = [];

  for (const experience of input.result.workExperiences) {
    rows.push({
      id: createId(),
      userId: input.userId,
      profileId: input.profileId ?? null,
      resumeId: input.resumeId,
      kind: "work_experience",
      status: "pending",
      confidence: String(experience.confidence),
      payload: {
        company: experience.company,
        title: experience.title,
        startDate: experience.startDate,
        endDate: experience.endDate,
        description: experience.description,
        technologies: experience.technologies,
        achievements: experience.achievements,
      },
      sourceSpan: experience.sourceSpan ?? null,
    });
  }

  for (const education of input.result.education) {
    rows.push({
      id: createId(),
      userId: input.userId,
      profileId: input.profileId ?? null,
      resumeId: input.resumeId,
      kind: "education",
      status: "pending",
      confidence: String(education.confidence),
      payload: {
        school: education.school,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        startDate: education.startDate,
        endDate: education.endDate,
      },
      sourceSpan: education.sourceSpan ?? null,
    });
  }

  for (const skill of input.result.skills) {
    if (!skill.name) {
      continue;
    }
    rows.push({
      id: createId(),
      userId: input.userId,
      profileId: input.profileId ?? null,
      resumeId: input.resumeId,
      kind: "skill",
      status: "pending",
      confidence: String(skill.confidence),
      payload: {
        name: skill.name,
        category: skill.category,
        yearsOfExperience: skill.yearsOfExperience,
      },
      sourceSpan: null,
    });
  }

  if (rows.length > 0) {
    await db.insert(factProposals).values(rows);
  }

  return { extractionId, proposalCount: rows.length };
}

/**
 * Runs deterministic text extraction against provided résumé text and stores
 * pending proposals only. Callers supply text (PDF/DOCX parsing is separate).
 */
export async function runResumeTextExtraction(input: {
  userId: string;
  resumeId: string;
  profileId?: string | null;
  text: string;
}) {
  const resumeRows = await db
    .select()
    .from(resumes)
    .where(
      and(eq(resumes.id, input.resumeId), eq(resumes.userId, input.userId)),
    )
    .limit(1);

  if (resumeRows.length === 0) {
    throw new ResumeServiceError("Resume not found.", 404);
  }

  const result = extractResumeProposalsFromText(input.text);
  return persistExtractionProposals({
    userId: input.userId,
    resumeId: input.resumeId,
    profileId: input.profileId,
    extractedText: input.text,
    result,
  });
}

/** Lists fact proposals for the signed-in user, newest first. */
export async function listFactProposalsForUser(
  userId: string,
  status?: string,
) {
  const rows = status
    ? await db
        .select()
        .from(factProposals)
        .where(
          and(
            eq(factProposals.userId, userId),
            eq(factProposals.status, status),
          ),
        )
        .orderBy(desc(factProposals.createdAt))
    : await db
        .select()
        .from(factProposals)
        .where(eq(factProposals.userId, userId))
        .orderBy(desc(factProposals.createdAt));

  return factProposalListResponseSchema.parse({
    proposals: rows.map(mapProposalRow),
  });
}

/**
 * Approves, rejects, or edits a proposal. Approval promotes into canonical
 * profile tables; rejected proposals never reach autofill.
 */
export async function reviewFactProposal(
  userId: string,
  proposalId: string,
  body: unknown,
) {
  const input = reviewFactProposalInputSchema.parse(body);
  const proposalRows = await db
    .select()
    .from(factProposals)
    .where(
      and(
        eq(factProposals.id, proposalId),
        eq(factProposals.userId, userId),
      ),
    )
    .limit(1);

  if (proposalRows.length === 0) {
    throw new ResumeServiceError("Proposal not found.", 404);
  }
  const proposal = proposalRows[0];

  if (proposal.status !== "pending" && proposal.status !== "draft") {
    throw new ResumeServiceError("Proposal already reviewed.", 409);
  }

  const now = new Date();
  let payload = proposal.payload;
  if (input.action === "edit") {
    if (!input.payload) {
      throw new ResumeServiceError(
        "Edited proposals require a payload.",
        400,
      );
    }
    payload = input.payload;
  }

  if (input.action === "reject") {
    const updatedRows = await db
      .update(factProposals)
      .set({
        status: "rejected",
        payload,
        reviewedAt: now,
        updatedAt: now,
      })
      .where(eq(factProposals.id, proposalId))
      .returning();

    if (updatedRows.length === 0) {
      throw new ResumeServiceError("Proposal not found.", 404);
    }
    return mapProposalRow(updatedRows[0]);
  }

  const settingsRows = await db
    .select()
    .from(userProfileSettings)
    .where(eq(userProfileSettings.userId, userId))
    .limit(1);
  const activeProfileId =
    settingsRows.length === 0 ? null : settingsRows[0].activeProfileId;

  const profileId =
    input.profileId ?? proposal.profileId ?? activeProfileId ?? null;
  if (!profileId) {
    throw new ResumeServiceError(
      "Choose a profile before approving this proposal.",
      400,
    );
  }

  const profileRows = await db
    .select()
    .from(applicantProfiles)
    .where(
      and(
        eq(applicantProfiles.id, profileId),
        eq(applicantProfiles.userId, userId),
      ),
    )
    .limit(1);
  if (profileRows.length === 0) {
    throw new ResumeServiceError("Profile not found.", 404);
  }

  if (proposal.kind === "work_experience") {
    const company = String(payload.company ?? "").trim();
    const title = String(payload.title ?? "").trim();
    if (!company || !title) {
      throw new ResumeServiceError(
        "Approved work experience needs company and title.",
        400,
      );
    }
    await db.insert(workExperiences).values({
      id: createId(),
      profileId,
      company,
      title,
      startDate: String(payload.startDate ?? "").trim() || "Unknown",
      endDate: String(payload.endDate ?? "").trim(),
      description: String(payload.description ?? "").trim(),
      technologies: Array.isArray(payload.technologies)
        ? (payload.technologies as string[])
        : [],
      achievements: Array.isArray(payload.achievements)
        ? (payload.achievements as string[])
        : [],
    });
  }

  if (proposal.kind === "education") {
    const school = String(payload.school ?? "").trim();
    if (!school) {
      throw new ResumeServiceError(
        "Approved education needs a school name.",
        400,
      );
    }
    await db.insert(profileEducation).values({
      id: createId(),
      profileId,
      school,
      degree: String(payload.degree ?? "").trim(),
      fieldOfStudy: String(payload.fieldOfStudy ?? "").trim(),
      startDate: String(payload.startDate ?? "").trim(),
      endDate: String(payload.endDate ?? "").trim(),
    });
  }

  if (proposal.kind === "skill") {
    const name = String(payload.name ?? "").trim();
    if (!name) {
      throw new ResumeServiceError("Approved skill needs a name.", 400);
    }
    await db.insert(profileSkills).values({
      id: createId(),
      profileId,
      name,
      category: String(payload.category ?? "Skills").trim() || "Skills",
      yearsOfExperience: Number(payload.yearsOfExperience ?? 0) || 0,
    });
  }

  const updatedRows = await db
    .update(factProposals)
    .set({
      status: "confirmed",
      payload,
      profileId,
      reviewedAt: now,
      updatedAt: now,
    })
    .where(eq(factProposals.id, proposalId))
    .returning();

  if (updatedRows.length === 0) {
    throw new ResumeServiceError("Proposal not found.", 404);
  }
  return mapProposalRow(updatedRows[0]);
}
