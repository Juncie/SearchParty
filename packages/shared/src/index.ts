import { z } from "zod";

export const SEARCHPARTY_APP = {
  name: "SearchParty",
  webDevUrl: "http://localhost:3001",
} as const;

export const healthStatusSchema = z.enum(["ok"]);

export const healthResponseSchema = z.object({
  app: z.literal(SEARCHPARTY_APP.name),
  status: healthStatusSchema,
  timestamp: z.string().datetime(),
  version: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export function createHealthResponse(version = "0.0.0"): HealthResponse {
  return healthResponseSchema.parse({
    app: SEARCHPARTY_APP.name,
    status: "ok",
    timestamp: new Date().toISOString(),
    version,
  });
}

export const applicantProfileToneSchema = z.enum([
  "professional",
  "confident",
  "friendly",
]);

export type ApplicantProfileTone = z.infer<
  typeof applicantProfileToneSchema
>;

export const workExperienceInputSchema = z.object({
  company: z.string().trim().min(1, "Company is required"),
  title: z.string().trim().min(1, "Title is required"),
  startDate: z.string().trim().min(1, "Start date is required"),
  endDate: z.string().trim().optional().default(""),
  description: z.string().trim().optional().default(""),
  technologies: z.array(z.string().trim().min(1)).default([]),
  achievements: z.array(z.string().trim().min(1)).default([]),
});

export const profileSkillInputSchema = z.object({
  name: z.string().trim().min(1, "Skill name is required"),
  category: z.string().trim().min(1, "Skill category is required"),
  yearsOfExperience: z.coerce.number().min(0).max(80).default(0),
});

export const profileProjectInputSchema = z.object({
  name: z.string().trim().min(1, "Project name is required"),
  description: z.string().trim().optional().default(""),
  technologies: z.array(z.string().trim().min(1)).default([]),
  url: z.string().trim().url().or(z.literal("")).default(""),
});

export const applicantProfileInputSchema = z.object({
  name: z.string().trim().min(1, "Profile name is required"),
  targetRole: z.string().trim().min(1, "Target role is required"),
  summary: z.string().trim().optional().default(""),
  preferredTone: applicantProfileToneSchema.default("professional"),
  workExperiences: z.array(workExperienceInputSchema).default([]),
  skills: z.array(profileSkillInputSchema).default([]),
  projects: z.array(profileProjectInputSchema).default([]),
});

export type ApplicantProfileInput = z.infer<
  typeof applicantProfileInputSchema
>;

export const applicantProfileUpdateSchema =
  applicantProfileInputSchema.partial();

export type ApplicantProfileUpdate = z.infer<
  typeof applicantProfileUpdateSchema
>;

export const workExperienceSchema = workExperienceInputSchema.extend({
  id: z.string(),
  profileId: z.string(),
});

export const profileSkillSchema = profileSkillInputSchema.extend({
  id: z.string(),
  profileId: z.string(),
});

export const profileProjectSchema = profileProjectInputSchema.extend({
  id: z.string(),
  profileId: z.string(),
});

export const applicantProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  targetRole: z.string(),
  summary: z.string(),
  preferredTone: applicantProfileToneSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  workExperiences: z.array(workExperienceSchema),
  skills: z.array(profileSkillSchema),
  projects: z.array(profileProjectSchema),
});

export type ApplicantProfile = z.infer<typeof applicantProfileSchema>;

export const applicantProfilesResponseSchema = z.object({
  profiles: z.array(applicantProfileSchema),
  activeProfileId: z.string().nullable(),
});

export type ApplicantProfilesResponse = z.infer<
  typeof applicantProfilesResponseSchema
>;

export const activeApplicantProfileInputSchema = z.object({
  profileId: z.string().nullable(),
});

export const currentUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  image: z.string().nullable().optional(),
});

export type CurrentUser = z.infer<typeof currentUserSchema>;

export const currentUserResponseSchema = z.object({
  user: currentUserSchema,
});

export type CurrentUserResponse = z.infer<
  typeof currentUserResponseSchema
>;

export const updateCurrentUserInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export type UpdateCurrentUserInput = z.infer<
  typeof updateCurrentUserInputSchema
>;
