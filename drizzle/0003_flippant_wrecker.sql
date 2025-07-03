CREATE TABLE "user_tokens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_tokens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"refreshToken" varchar(512) NOT NULL,
	"createdAt" varchar(50) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"userAgent" varchar(255),
	"ipAddress" varchar(50),
	CONSTRAINT "user_tokens_refreshToken_unique" UNIQUE("refreshToken")
);
--> statement-breakpoint
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;