import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  title: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

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
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})
