import dotenv from "dotenv";
import { z } from "zod";
import path from "path";
import logger from "@/lib/logger";

// Load .env.<NODE_ENV> or fallback to .env
dotenv.config({
	path: path.resolve(
		process.cwd(),
		`.env.${process.env.NODE_ENV || "development"}`
	)
});

// Define schema
const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	LOG_LEVEL: z
		.enum(["error", "warn", "info", "http", "verbose", "debug"])
		.default("info"),
	PORT: z.string().default("3000"),
	DATABASE_URL: z.string().url(),
	HASH_SALT: z.string().min(1),
	JWT_ACCESSTOKEN_SECRET: z.string().min(1),
	JWT_REFRESHTOKEN_SECRET: z.string().min(1),
	ACCESSTOKEN_DURATION: z.string().min(1),
	REFRESHTOKEN_DURATION: z.string().min(1),
	POSTGRES_DB: z.string().min(1),
	POSTGRES_USER: z.string().min(1),
	POSTGRES_PASSWORD: z.string().min(1),
	REDIS_HOST: z.string().min(1),
	REDIS_PORT: z.string().min(1),

	// oAuth credentials
	AUTH_GOOGLE_CLIENT_ID: z.string().nonempty(),
	AUTH_GOOGLE_CLIENT_SECRET: z.string().nonempty(),

	// Mailer credentials
	SMTP_HOST: z.string().nonempty(),
	SMTP_PORT: z.string().nonempty(),
	SMTP_USER: z.string().nonempty(),
	SMTP_PASS: z.string().nonempty(),
	SMTP_FROM: z.string().nonempty()
});

// Validate and parse
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	logger.error("❌ Invalid environment variables:", parsedEnv.error.format());
	process.exit(1); // Crash early
}

export const env = parsedEnv.data;
