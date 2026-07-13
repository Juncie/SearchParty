import { z } from "zod";

export const applicationStatusSchema = z.enum([
  "saved",
  "started",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "archived",
]);

export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;

export const applicationInputSchema = z.object({
  profileId: z.string().nullable().optional(),
  jobPostingId: z.string().min(1),
  resumeId: z.string().nullable().optional(),
  status: applicationStatusSchema.default("saved"),
  notes: z.string().trim().default(""),
});

export type ApplicationInput = z.infer<typeof applicationInputSchema>;

export const applicationUpdateSchema = z.object({
  status: applicationStatusSchema.optional(),
  notes: z.string().trim().optional(),
  profileId: z.string().nullable().optional(),
  resumeId: z.string().nullable().optional(),
});

export type ApplicationUpdate = z.infer<typeof applicationUpdateSchema>;

export const applicationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  profileId: z.string().nullable(),
  jobPostingId: z.string(),
  resumeId: z.string().nullable(),
  status: applicationStatusSchema,
  notes: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Application = z.infer<typeof applicationSchema>;

export const applicationsResponseSchema = z.object({
  applications: z.array(applicationSchema),
});

export type ApplicationsResponse = z.infer<
  typeof applicationsResponseSchema
>;

/** Allowed forward transitions for application status updates. */
export const APPLICATION_STATUS_TRANSITIONS: Record<
  ApplicationStatus,
  ReadonlyArray<ApplicationStatus>
> = {
  saved: ["started", "applied", "archived"],
  started: ["applied", "archived"],
  applied: ["interviewing", "rejected", "offer", "archived"],
  interviewing: ["offer", "rejected", "archived"],
  offer: ["archived", "rejected"],
  rejected: ["archived"],
  archived: [],
};

export function canTransitionApplicationStatus(
  from: ApplicationStatus,
  to: ApplicationStatus,
): boolean {
  if (from === to) {
    return true;
  }
  return APPLICATION_STATUS_TRANSITIONS[from].includes(to);
}
