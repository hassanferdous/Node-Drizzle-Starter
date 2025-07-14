CREATE TABLE "denied_permissions" (
	"permission_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "denied_permissions_user_id_permission_id_pk" PRIMARY KEY("user_id","permission_id")
);
--> statement-breakpoint
ALTER TABLE "denied_permissions" ADD CONSTRAINT "denied_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "denied_permissions" ADD CONSTRAINT "denied_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;