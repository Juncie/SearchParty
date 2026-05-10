ALTER TABLE "user_profile_settings" ADD COLUMN "first_name" text DEFAULT '' NOT NULL;
ALTER TABLE "user_profile_settings" ADD COLUMN "last_name" text DEFAULT '' NOT NULL;
ALTER TABLE "user_profile_settings" ADD COLUMN "phone" text DEFAULT '' NOT NULL;
ALTER TABLE "user_profile_settings" ADD COLUMN "address" text DEFAULT '' NOT NULL;
ALTER TABLE "user_profile_settings" ADD COLUMN "urls" jsonb DEFAULT '[]'::jsonb NOT NULL;
