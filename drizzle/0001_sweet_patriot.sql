ALTER TABLE "projects" ADD COLUMN "description" varchar;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "category" varchar(100);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "priority" integer DEFAULT 0;