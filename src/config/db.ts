import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from ".";
export const db = drizzle(process.env.DATABASE_URL!);
