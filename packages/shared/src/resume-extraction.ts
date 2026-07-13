import { z } from "zod";

import { approvalStatusSchema } from "./answers/types";

/** Kind of structured claim extracted from a résumé. */
export const factProposalKindSchema = z.enum([
  "work_experience",
  "education",
  "skill",
  "project",
  "contact",
  "summary",
]);

export type FactProposalKind = z.infer<typeof factProposalKindSchema>;

/** Source span citation inside extracted document text. */
export const factSourceSpanSchema = z.object({
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
  excerpt: z.string().optional(),
});

export type FactSourceSpan = z.infer<typeof factSourceSpanSchema>;

/** Structured payload for a single résumé extraction proposal. */
export const factProposalPayloadSchema = z.object({
  company: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  school: z.string().nullable().optional(),
  degree: z.string().nullable().optional(),
  fieldOfStudy: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  yearsOfExperience: z.number().nullable().optional(),
  technologies: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  url: z.string().nullable().optional(),
  rawText: z.string().nullable().optional(),
});

export type FactProposalPayload = z.infer<
  typeof factProposalPayloadSchema
>;

export const factProposalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  profileId: z.string().nullable(),
  resumeId: z.string(),
  kind: factProposalKindSchema,
  status: approvalStatusSchema,
  confidence: z.number().min(0).max(1),
  payload: factProposalPayloadSchema,
  sourceSpan: factSourceSpanSchema.nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  reviewedAt: z.string().datetime().nullable(),
});

export type FactProposal = z.infer<typeof factProposalSchema>;

export const factProposalListResponseSchema = z.object({
  proposals: z.array(factProposalSchema),
});

export type FactProposalListResponse = z.infer<
  typeof factProposalListResponseSchema
>;

export const reviewFactProposalInputSchema = z.object({
  action: z.enum(["approve", "reject", "edit"]),
  /** Required when action is edit — replaces proposal payload before approval. */
  payload: factProposalPayloadSchema.optional(),
  profileId: z.string().optional(),
});

export type ReviewFactProposalInput = z.infer<
  typeof reviewFactProposalInputSchema
>;

export const documentExtractionStatusSchema = z.enum([
  "pending",
  "ready",
  "failed",
]);

export const documentExtractionSchema = z.object({
  id: z.string(),
  resumeId: z.string(),
  userId: z.string(),
  status: documentExtractionStatusSchema,
  extractorVersion: z.string(),
  extractedTextPreview: z.string().nullable(),
  errorMessage: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type DocumentExtraction = z.infer<
  typeof documentExtractionSchema
>;

/**
 * Schema-constrained extraction result. Missing fields must be null —
 * extractors must never invent employers, dates, or credentials.
 */
export const resumeExtractionResultSchema = z.object({
  summary: z.string().nullable(),
  workExperiences: z.array(
    z.object({
      company: z.string().nullable(),
      title: z.string().nullable(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      description: z.string().nullable(),
      technologies: z.array(z.string()).default([]),
      achievements: z.array(z.string()).default([]),
      sourceSpan: factSourceSpanSchema.nullable().optional(),
      confidence: z.number().min(0).max(1).default(0.5),
    }),
  ),
  education: z.array(
    z.object({
      school: z.string().nullable(),
      degree: z.string().nullable(),
      fieldOfStudy: z.string().nullable(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      sourceSpan: factSourceSpanSchema.nullable().optional(),
      confidence: z.number().min(0).max(1).default(0.5),
    }),
  ),
  skills: z.array(
    z.object({
      name: z.string().nullable(),
      category: z.string().nullable(),
      yearsOfExperience: z.number().nullable(),
      confidence: z.number().min(0).max(1).default(0.5),
    }),
  ),
  projects: z.array(
    z.object({
      name: z.string().nullable(),
      description: z.string().nullable(),
      url: z.string().nullable(),
      technologies: z.array(z.string()).default([]),
      confidence: z.number().min(0).max(1).default(0.5),
    }),
  ),
});

export type ResumeExtractionResult = z.infer<
  typeof resumeExtractionResultSchema
>;

export const EXTRACTOR_VERSION = "searchparty-resume-v1";
