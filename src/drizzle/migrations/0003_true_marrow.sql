ALTER TABLE "vehicles" ADD COLUMN "image_url" varchar(255);--> statement-breakpoint
ALTER TABLE "vehicle_specifications" DROP COLUMN IF EXISTS "image_url";