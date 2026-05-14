import { and, desc, eq, inArray } from 'drizzle-orm'
import {
  accountOnboardingInputSchema,
  accountSetupResponseSchema,
  accountSetupSchema,
  activeApplicantProfileInputSchema,
  applicantProfileInputSchema,
  applicantProfileSchema,
  applicantProfileToneSchema,
  applicantProfileUpdateSchema,
} from '@searchparty/shared'
import {
  applicantProfiles,
  profileProjects,
  profileSkills,
  userProfileSettings,
  workExperiences,
} from '@searchparty/db'
import type { ApplicantProfile, ApplicantProfileInput } from '@searchparty/shared'
import { db } from '#/db'

function createId() {
  return crypto.randomUUID()
}

function toIsoDate(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

async function readProfilesForUser(userId: string): Promise<ApplicantProfile[]> {
  const profiles = await db
    .select()
    .from(applicantProfiles)
    .where(eq(applicantProfiles.userId, userId))
    .orderBy(desc(applicantProfiles.updatedAt))

  if (profiles.length === 0) {
    return []
  }

  const profileIds = profiles.map((profile) => profile.id)
  const [workRows, skillRows, projectRows] = await Promise.all([
    db
      .select()
      .from(workExperiences)
      .where(inArray(workExperiences.profileId, profileIds)),
    db.select().from(profileSkills).where(inArray(profileSkills.profileId, profileIds)),
    db
      .select()
      .from(profileProjects)
      .where(inArray(profileProjects.profileId, profileIds)),
  ])

  return profiles.map((profile) =>
    applicantProfileSchema.parse({
      ...profile,
      onboardingAnswers: profile.onboardingAnswers,
      preferredTone: applicantProfileToneSchema.parse(profile.preferredTone),
      createdAt: toIsoDate(profile.createdAt),
      updatedAt: toIsoDate(profile.updatedAt),
      workExperiences: workRows.filter((row) => row.profileId === profile.id),
      skills: skillRows.filter((row) => row.profileId === profile.id),
      projects: projectRows.filter((row) => row.profileId === profile.id),
    }),
  )
}

export async function listApplicantProfiles(userId: string) {
  const [profiles, settings] = await Promise.all([
    readProfilesForUser(userId),
    db
      .select()
      .from(userProfileSettings)
      .where(eq(userProfileSettings.userId, userId))
      .limit(1),
  ])

  const activeProfileId = profiles.some(
    (profile) => profile.id === settings[0]?.activeProfileId,
  )
    ? settings[0]?.activeProfileId ?? null
    : profiles[0]?.id ?? null

  return { profiles, activeProfileId }
}

async function replaceNestedProfileData(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  profileId: string,
  input: Pick<ApplicantProfileInput, 'workExperiences' | 'skills' | 'projects'>,
) {
  await Promise.all([
    tx.delete(workExperiences).where(eq(workExperiences.profileId, profileId)),
    tx.delete(profileSkills).where(eq(profileSkills.profileId, profileId)),
    tx.delete(profileProjects).where(eq(profileProjects.profileId, profileId)),
  ])

  if (input.workExperiences.length > 0) {
    await tx.insert(workExperiences).values(
      input.workExperiences.map((experience) => ({
        ...experience,
        id: createId(),
        profileId,
      })),
    )
  }

  if (input.skills.length > 0) {
    await tx.insert(profileSkills).values(
      input.skills.map((skill) => ({
        ...skill,
        id: createId(),
        profileId,
      })),
    )
  }

  if (input.projects.length > 0) {
    await tx.insert(profileProjects).values(
      input.projects.map((project) => ({
        ...project,
        id: createId(),
        profileId,
      })),
    )
  }
}

export async function createApplicantProfile(userId: string, rawInput: unknown) {
  const input = applicantProfileInputSchema.parse(rawInput)
  const profileId = createId()

  await db.transaction(async (tx) => {
    await tx.insert(applicantProfiles).values({
      id: profileId,
      userId,
      name: input.name,
      targetRole: input.targetRole,
      summary: input.summary,
      preferredTone: input.preferredTone,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      address: input.address,
      linkedinUrl: input.linkedinUrl,
      githubUrl: input.githubUrl,
      portfolioUrl: input.portfolioUrl,
      onboardingAnswers: input.onboardingAnswers,
    })

    await replaceNestedProfileData(tx, profileId, input)

    await tx.insert(userProfileSettings)
      .values({ userId, activeProfileId: profileId })
      .onConflictDoUpdate({
        target: userProfileSettings.userId,
        set: { activeProfileId: profileId },
      })
  })

  return readApplicantProfile(userId, profileId)
}

export async function readApplicantProfile(userId: string, profileId: string) {
  const profiles = await readProfilesForUser(userId)
  return profiles.find((profile) => profile.id === profileId) ?? null
}

export async function updateApplicantProfile(
  userId: string,
  profileId: string,
  rawInput: unknown,
) {
  const input = applicantProfileUpdateSchema.parse(rawInput)
  const existing = await readApplicantProfile(userId, profileId)

  if (!existing) {
    return null
  }

  await db.transaction(async (tx) => {
    const profileUpdates: Partial<typeof applicantProfiles.$inferInsert> = {}

    if (input.name !== undefined) profileUpdates.name = input.name
    if (input.targetRole !== undefined) profileUpdates.targetRole = input.targetRole
    if (input.summary !== undefined) profileUpdates.summary = input.summary
    if (input.preferredTone !== undefined) {
      profileUpdates.preferredTone = input.preferredTone
    }
    if (input.firstName !== undefined) profileUpdates.firstName = input.firstName
    if (input.lastName !== undefined) profileUpdates.lastName = input.lastName
    if (input.phone !== undefined) profileUpdates.phone = input.phone
    if (input.address !== undefined) profileUpdates.address = input.address
    if (input.linkedinUrl !== undefined) profileUpdates.linkedinUrl = input.linkedinUrl
    if (input.githubUrl !== undefined) profileUpdates.githubUrl = input.githubUrl
    if (input.portfolioUrl !== undefined) profileUpdates.portfolioUrl = input.portfolioUrl
    if (input.onboardingAnswers !== undefined) {
      profileUpdates.onboardingAnswers = input.onboardingAnswers
    }

    if (Object.keys(profileUpdates).length > 0) {
      await tx
        .update(applicantProfiles)
        .set({ ...profileUpdates, updatedAt: new Date() })
        .where(
          and(
            eq(applicantProfiles.id, profileId),
            eq(applicantProfiles.userId, userId),
          ),
        )
    }

    await replaceNestedProfileData(tx, profileId, {
      workExperiences: input.workExperiences ?? existing.workExperiences,
      skills: input.skills ?? existing.skills,
      projects: input.projects ?? existing.projects,
    })
  })

  return readApplicantProfile(userId, profileId)
}

export async function deleteApplicantProfile(userId: string, profileId: string) {
  const existing = await readApplicantProfile(userId, profileId)

  if (!existing) {
    return false
  }

  await db
    .delete(applicantProfiles)
    .where(
      and(eq(applicantProfiles.id, profileId), eq(applicantProfiles.userId, userId)),
    )

  const { profiles, activeProfileId } = await listApplicantProfiles(userId)

  if (activeProfileId === profileId || profiles.length > 0) {
    await setActiveApplicantProfile(userId, {
      profileId: profiles[0]?.id ?? null,
    })
  }

  return true
}

export async function setActiveApplicantProfile(userId: string, rawInput: unknown) {
  const input = activeApplicantProfileInputSchema.parse(rawInput)

  if (input.profileId) {
    const profile = await readApplicantProfile(userId, input.profileId)
    if (!profile) {
      return null
    }
  }

  await db
    .insert(userProfileSettings)
    .values({ userId, activeProfileId: input.profileId })
    .onConflictDoUpdate({
      target: userProfileSettings.userId,
      set: { activeProfileId: input.profileId, updatedAt: new Date() },
    })

  return listApplicantProfiles(userId)
}

export async function readAccountSetup(userId: string) {
  const settings = await db
    .select()
    .from(userProfileSettings)
    .where(eq(userProfileSettings.userId, userId))
    .limit(1)

  if (settings.length === 0) {
    return accountSetupResponseSchema.parse({
      firstName: '',
      lastName: '',
      phone: '',
      addressStreet: '',
      addressState: '',
      addressCity: '',
      addressZip: '',
      addressUnit: '',
      urls: [],
      accountOnboardingCompletedAt: null,
      accountOnboardingAnswers: {},
    })
  }

  const row = settings[0]
  return accountSetupResponseSchema.parse({
    firstName: row.firstName,
    lastName: row.lastName,
    phone: row.phone,
    addressStreet: row.addressStreet,
    addressState: row.addressState,
    addressCity: row.addressCity,
    addressZip: row.addressZip,
    addressUnit: row.addressUnit,
    urls: row.urls,
    accountOnboardingCompletedAt: row.accountOnboardingCompletedAt
      ? toIsoDate(row.accountOnboardingCompletedAt)
      : null,
    accountOnboardingAnswers: row.accountOnboardingAnswers,
  })
}

export async function updateAccountSetup(userId: string, rawInput: unknown) {
  const input = accountSetupSchema.parse(rawInput)

  await db
    .insert(userProfileSettings)
    .values({
      userId,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      addressStreet: input.addressStreet,
      addressState: input.addressState,
      addressCity: input.addressCity,
      addressZip: input.addressZip,
      addressUnit: input.addressUnit,
      urls: input.urls,
    })
    .onConflictDoUpdate({
      target: userProfileSettings.userId,
      set: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        addressStreet: input.addressStreet,
        addressState: input.addressState,
        addressCity: input.addressCity,
        addressZip: input.addressZip,
        addressUnit: input.addressUnit,
        urls: input.urls,
        updatedAt: new Date(),
      },
    })

  return readAccountSetup(userId)
}

/**
 * Persists account-level onboarding answers and marks eligibility complete (one-time per user).
 */
export async function markAccountOnboardingComplete(userId: string, rawInput: unknown) {
  const { answers } = accountOnboardingInputSchema.parse(rawInput)

  const existing = await db
    .select()
    .from(userProfileSettings)
    .where(eq(userProfileSettings.userId, userId))
    .limit(1)

  const mergedAnswers = {
    ...(existing[0]?.accountOnboardingAnswers ?? {}),
    ...answers,
  }
  const now = new Date()

  await db
    .insert(userProfileSettings)
    .values({
      userId,
      accountOnboardingAnswers: mergedAnswers,
      accountOnboardingCompletedAt: now,
    })
    .onConflictDoUpdate({
      target: userProfileSettings.userId,
      set: {
        accountOnboardingAnswers: mergedAnswers,
        accountOnboardingCompletedAt: now,
        updatedAt: now,
      },
    })

  return readAccountSetup(userId)
}
