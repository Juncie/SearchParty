ALTER TABLE "applicant_profiles" ADD COLUMN "onboarding_answers" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profile_settings" ADD COLUMN "account_onboarding_answers" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profile_settings" ADD COLUMN "account_onboarding_completed_at" timestamp;
