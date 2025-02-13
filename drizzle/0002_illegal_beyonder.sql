ALTER TABLE "projects" ALTER COLUMN "priority" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "priority" SET DEFAULT 'medium';