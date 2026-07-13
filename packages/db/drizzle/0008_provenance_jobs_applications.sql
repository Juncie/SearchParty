CREATE TABLE "profile_education" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"school" text NOT NULL,
	"degree" text DEFAULT '' NOT NULL,
	"field_of_study" text DEFAULT '' NOT NULL,
	"start_date" text DEFAULT '' NOT NULL,
	"end_date" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_document_links" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"resume_id" text NOT NULL,
	"role" text DEFAULT 'primary_resume' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_extractions" (
	"id" text PRIMARY KEY NOT NULL,
	"resume_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"extractor_version" text NOT NULL,
	"extracted_text" text DEFAULT '' NOT NULL,
	"error_message" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fact_proposals" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"profile_id" text,
	"resume_id" text NOT NULL,
	"kind" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"confidence" text DEFAULT '0.5' NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_span" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "job_postings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"source_url" text NOT NULL,
	"platform" text DEFAULT 'generic' NOT NULL,
	"company" text DEFAULT '' NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"requirements" text DEFAULT '' NOT NULL,
	"extractor_version" text DEFAULT '' NOT NULL,
	"raw_evidence" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"profile_id" text,
	"job_posting_id" text NOT NULL,
	"resume_id" text,
	"status" text DEFAULT 'saved' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_events" (
	"id" text PRIMARY KEY NOT NULL,
	"application_id" text NOT NULL,
	"from_status" text DEFAULT '' NOT NULL,
	"to_status" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generated_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"profile_id" text,
	"job_posting_id" text,
	"kind" text DEFAULT 'cover_letter' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"evidence_json" jsonb DEFAULT '{"factIds":[]}'::jsonb NOT NULL,
	"model" text DEFAULT '' NOT NULL,
	"prompt_version" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "custom_answers" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"profile_id" text,
	"question_pattern" text NOT NULL,
	"source_question" text DEFAULT '' NOT NULL,
	"answer" text NOT NULL,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"evidence_json" jsonb DEFAULT '{"factIds":[]}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generation_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"generated_document_id" text,
	"model" text DEFAULT '' NOT NULL,
	"prompt_version" text DEFAULT '' NOT NULL,
	"input_fact_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_education" ADD CONSTRAINT "profile_education_profile_id_applicant_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."applicant_profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "profile_document_links" ADD CONSTRAINT "profile_document_links_profile_id_applicant_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."applicant_profiles"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "profile_document_links" ADD CONSTRAINT "profile_document_links_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "document_extractions" ADD CONSTRAINT "document_extractions_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "document_extractions" ADD CONSTRAINT "document_extractions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "fact_proposals" ADD CONSTRAINT "fact_proposals_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "fact_proposals" ADD CONSTRAINT "fact_proposals_profile_id_applicant_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."applicant_profiles"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "fact_proposals" ADD CONSTRAINT "fact_proposals_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_profile_id_applicant_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."applicant_profiles"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_posting_id_job_postings_id_fk" FOREIGN KEY ("job_posting_id") REFERENCES "public"."job_postings"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "application_events" ADD CONSTRAINT "application_events_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "generated_documents" ADD CONSTRAINT "generated_documents_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "generated_documents" ADD CONSTRAINT "generated_documents_profile_id_applicant_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."applicant_profiles"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "generated_documents" ADD CONSTRAINT "generated_documents_job_posting_id_job_postings_id_fk" FOREIGN KEY ("job_posting_id") REFERENCES "public"."job_postings"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "custom_answers" ADD CONSTRAINT "custom_answers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "custom_answers" ADD CONSTRAINT "custom_answers_profile_id_applicant_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."applicant_profiles"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "generation_runs" ADD CONSTRAINT "generation_runs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "generation_runs" ADD CONSTRAINT "generation_runs_generated_document_id_generated_documents_id_fk" FOREIGN KEY ("generated_document_id") REFERENCES "public"."generated_documents"("id") ON DELETE set null ON UPDATE no action;
