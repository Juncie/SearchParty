CREATE TABLE "applicant_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"target_role" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"preferred_tone" text DEFAULT 'professional' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_experiences" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"company" text NOT NULL,
	"title" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"technologies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"achievements" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_skills" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"years_of_experience" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_projects" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"technologies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"url" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profile_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"active_profile_id" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applicant_profiles" ADD CONSTRAINT "applicant_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "work_experiences" ADD CONSTRAINT "work_experiences_profile_id_applicant_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."applicant_profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "profile_skills" ADD CONSTRAINT "profile_skills_profile_id_applicant_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."applicant_profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "profile_projects" ADD CONSTRAINT "profile_projects_profile_id_applicant_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."applicant_profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_profile_settings" ADD CONSTRAINT "user_profile_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "user_profile_settings" ADD CONSTRAINT "user_profile_settings_active_profile_id_applicant_profiles_id_fk" FOREIGN KEY ("active_profile_id") REFERENCES "public"."applicant_profiles"("id") ON DELETE set null ON UPDATE no action;
