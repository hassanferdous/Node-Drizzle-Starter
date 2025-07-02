import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

prisma
	.$connect()
	.then(() => console.log("✅ Connected to PostgreSQL via Prisma"))
	.catch((err) => {
		console.error("❌ Failed to connect to DB", err);
		process.exit(1);
	});

export default prisma;
