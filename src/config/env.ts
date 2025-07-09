import dotenv from "dotenv";
import { z } from "zod";
import path from "path";

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
	PORT: z.string().default("3000"),
	DATABASE_URL: z.string().url()
	// JWT_SECRET: z.string().min(1)
});

// Validate and parse
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("❌ Invalid environment variables:");
	console.error(parsedEnv.error.format());
	process.exit(1); // Crash early
}

export const env = parsedEnv.data;
