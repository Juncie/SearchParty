import { z } from "zod";

export const jobPlatformSchema = z.enum([
  "greenhouse",
  "lever",
  "ashby",
  "generic",
]);

export type JobPlatform = z.infer<typeof jobPlatformSchema>;

export const jobExtractionInputSchema = z.object({
  sourceUrl: z.string().url(),
  platform: jobPlatformSchema.default("generic"),
  company: z.string().trim().default(""),
  title: z.string().trim().default(""),
  location: z.string().trim().default(""),
  description: z.string().trim().default(""),
  requirements: z.string().trim().default(""),
  extractorVersion: z.string().trim().default("job-extract-v1"),
  rawEvidence: z.record(z.string(), z.unknown()).default({}),
});

export type JobExtractionInput = z.infer<typeof jobExtractionInputSchema>;

export const jobPostingSchema = jobExtractionInputSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type JobPosting = z.infer<typeof jobPostingSchema>;

export const jobPostingsResponseSchema = z.object({
  jobs: z.array(jobPostingSchema),
});

export type JobPostingsResponse = z.infer<typeof jobPostingsResponseSchema>;

export const JOB_EXTRACTOR_VERSION = "job-extract-v1";
