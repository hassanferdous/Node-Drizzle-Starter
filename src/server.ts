import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { app } from "./app";
import { db } from "./config/db";
import { config } from "./config";

dotenv.config();

const PORT = config.app.port || 5001;

console.log(config, "server.js***********");

async function waitForDatabase(maxRetries = 5, delay = 2000) {
	console.log("🔍 Testing database connection...");

	for (let i = 0; i < maxRetries; i++) {
		try {
			await db.execute(sql`SELECT 1`);
			console.log("✅ Database connected successfully");
			return true;
		} catch (error) {
			console.log(
				`❌ Database connection attempt ${i + 1}/${maxRetries} failed`
			);

			if (i === maxRetries - 1) {
				console.error("💀 Failed to connect to database after all retries");
				throw error;
			}

			console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
}

async function startServer() {
	try {
		// Test database connection before starting server
		await waitForDatabase();

		// Start the server only if database is connected
		app.listen(PORT, () => {
			console.log(`🚀 Server running on port ${PORT}`);
			console.log(
				`📊 Health check available at: http://localhost:${PORT}/api/v1/health`
			);
		});
	} catch (error) {
		console.error("💥 Server startup failed:", (error as Error).message);
		console.error("🔧 Please check your database connection and try again");
		process.exit(1);
	}
}

// Handle graceful shutdown
process.on("SIGTERM", () => {
	console.log("🛑 Received SIGTERM, shutting down gracefully...");
	process.exit(0);
});

process.on("SIGINT", () => {
	console.log("🛑 Received SIGINT, shutting down gracefully...");
	process.exit(0);
});

// Start the server
startServer();
