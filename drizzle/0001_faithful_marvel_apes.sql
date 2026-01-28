ALTER TABLE "permissions" RENAME COLUMN "resource" TO "subject";--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "condition" text;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "inverted" boolean DEFAULT false;