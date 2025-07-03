import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "./db/schema";
import bcrypt from "bcryptjs";
const db = drizzle(process.env.DATABASE_URL!);

async function main() {
	const salt = await bcrypt.genSalt(Number(process.env.HASH_SALT as string));
	const hashPassword = await bcrypt.hash("test1234", salt);
	const user: typeof usersTable.$inferInsert = {
		email: "john@example.com",
		password: hashPassword,
	};

	await db.insert(usersTable).values(user);
	console.log("New user created!");
}

main();
