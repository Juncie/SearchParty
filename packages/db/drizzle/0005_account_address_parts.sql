ALTER TABLE "user_profile_settings" ADD COLUMN "address_street" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profile_settings" ADD COLUMN "address_unit" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profile_settings" ADD COLUMN "address_city" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profile_settings" ADD COLUMN "address_state" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profile_settings" ADD COLUMN "address_zip" text DEFAULT '' NOT NULL;--> statement-breakpoint
UPDATE "user_profile_settings" SET "address_street" = COALESCE("address", '') WHERE "address" IS NOT NULL AND "address" <> '';--> statement-breakpoint
ALTER TABLE "user_profile_settings" DROP COLUMN "address";
