import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'


export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const applicantProfiles = pgTable('applicant_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  targetRole: text('target_role').notNull(),
  summary: text('summary').notNull().default(''),
  preferredTone: text('preferred_tone').notNull().default('professional'),
  firstName: text('first_name').notNull().default(''),
  lastName: text('last_name').notNull().default(''),
  phone: text('phone').notNull().default(''),
  address: text('address').notNull().default(''),
  linkedinUrl: text('linkedin_url').notNull().default(''),
  githubUrl: text('github_url').notNull().default(''),
  portfolioUrl: text('portfolio_url').notNull().default(''),
  onboardingAnswers: jsonb('onboarding_answers')
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const workExperiences = pgTable('work_experiences', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => applicantProfiles.id, { onDelete: 'cascade' }),
  company: text('company').notNull(),
  title: text('title').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull().default(''),
  description: text('description').notNull().default(''),
  technologies: jsonb('technologies')
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  achievements: jsonb('achievements')
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
})

export const profileSkills = pgTable('profile_skills', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => applicantProfiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  category: text('category').notNull(),
  yearsOfExperience: integer('years_of_experience').notNull().default(0),
})

export const profileProjects = pgTable('profile_projects', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => applicantProfiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  technologies: jsonb('technologies')
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  url: text('url').notNull().default(''),
})

export const userProfileSettings = pgTable('user_profile_settings', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  activeProfileId: text('active_profile_id').references(
    () => applicantProfiles.id,
    { onDelete: 'set null' },
  ),
  firstName: text('first_name').notNull().default(''),
  lastName: text('last_name').notNull().default(''),
  phone: text('phone').notNull().default(''),
  addressStreet: text('address_street').notNull().default(''),
  addressUnit: text('address_unit').notNull().default(''),
  addressCity: text('address_city').notNull().default(''),
  addressState: text('address_state').notNull().default(''),
  addressZip: text('address_zip').notNull().default(''),
  urls: jsonb('urls')
    .$type<{ label: string; url: string }[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  accountOnboardingAnswers: jsonb('account_onboarding_answers')
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  accountOnboardingCompletedAt: timestamp('account_onboarding_completed_at'),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const resumes = pgTable('resumes', {
  id: text('id').primaryKey(),
  kind: text('kind').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  storageProvider: text('storage_provider').notNull(),
  storageKey: text('storage_key').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  checksum: text('checksum').notNull().default(''),
  uploadStatus: text('upload_status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const profileEducation = pgTable('profile_education', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => applicantProfiles.id, { onDelete: 'cascade' }),
  school: text('school').notNull(),
  degree: text('degree').notNull().default(''),
  fieldOfStudy: text('field_of_study').notNull().default(''),
  startDate: text('start_date').notNull().default(''),
  endDate: text('end_date').notNull().default(''),
})

export const profileDocumentLinks = pgTable('profile_document_links', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => applicantProfiles.id, { onDelete: 'cascade' }),
  resumeId: text('resume_id')
    .notNull()
    .references(() => resumes.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('primary_resume'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const documentExtractions = pgTable('document_extractions', {
  id: text('id').primaryKey(),
  resumeId: text('resume_id')
    .notNull()
    .references(() => resumes.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('pending'),
  extractorVersion: text('extractor_version').notNull(),
  extractedText: text('extracted_text').notNull().default(''),
  errorMessage: text('error_message').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const factProposals = pgTable('fact_proposals', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  profileId: text('profile_id').references(() => applicantProfiles.id, {
    onDelete: 'set null',
  }),
  resumeId: text('resume_id')
    .notNull()
    .references(() => resumes.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(),
  status: text('status').notNull().default('pending'),
  confidence: text('confidence').notNull().default('0.5'),
  payload: jsonb('payload')
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  sourceSpan: jsonb('source_span')
    .$type<Record<string, unknown> | null>()
    .default(sql`NULL`),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  reviewedAt: timestamp('reviewed_at'),
})

export const jobPostings = pgTable('job_postings', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  sourceUrl: text('source_url').notNull(),
  platform: text('platform').notNull().default('generic'),
  company: text('company').notNull().default(''),
  title: text('title').notNull().default(''),
  location: text('location').notNull().default(''),
  description: text('description').notNull().default(''),
  requirements: text('requirements').notNull().default(''),
  extractorVersion: text('extractor_version').notNull().default(''),
  rawEvidence: jsonb('raw_evidence')
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const applications = pgTable('applications', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  profileId: text('profile_id').references(() => applicantProfiles.id, {
    onDelete: 'set null',
  }),
  jobPostingId: text('job_posting_id')
    .notNull()
    .references(() => jobPostings.id, { onDelete: 'cascade' }),
  resumeId: text('resume_id').references(() => resumes.id, {
    onDelete: 'set null',
  }),
  status: text('status').notNull().default('saved'),
  notes: text('notes').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const applicationEvents = pgTable('application_events', {
  id: text('id').primaryKey(),
  applicationId: text('application_id')
    .notNull()
    .references(() => applications.id, { onDelete: 'cascade' }),
  fromStatus: text('from_status').notNull().default(''),
  toStatus: text('to_status').notNull(),
  note: text('note').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const generatedDocuments = pgTable('generated_documents', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  profileId: text('profile_id').references(() => applicantProfiles.id, {
    onDelete: 'set null',
  }),
  jobPostingId: text('job_posting_id').references(() => jobPostings.id, {
    onDelete: 'set null',
  }),
  kind: text('kind').notNull().default('cover_letter'),
  content: text('content').notNull().default(''),
  status: text('status').notNull().default('draft'),
  evidenceJson: jsonb('evidence_json')
    .$type<{ factIds: string[]; notes?: string }>()
    .notNull()
    .default(sql`'{"factIds":[]}'::jsonb`),
  model: text('model').notNull().default(''),
  promptVersion: text('prompt_version').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  approvedAt: timestamp('approved_at'),
})

export const customAnswers = pgTable('custom_answers', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  profileId: text('profile_id').references(() => applicantProfiles.id, {
    onDelete: 'set null',
  }),
  questionPattern: text('question_pattern').notNull(),
  sourceQuestion: text('source_question').notNull().default(''),
  answer: text('answer').notNull(),
  status: text('status').notNull().default('confirmed'),
  evidenceJson: jsonb('evidence_json')
    .$type<{ factIds: string[] }>()
    .notNull()
    .default(sql`'{"factIds":[]}'::jsonb`),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const generationRuns = pgTable('generation_runs', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  generatedDocumentId: text('generated_document_id').references(
    () => generatedDocuments.id,
    { onDelete: 'set null' },
  ),
  model: text('model').notNull().default(''),
  promptVersion: text('prompt_version').notNull().default(''),
  inputFactIds: jsonb('input_fact_ids')
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
