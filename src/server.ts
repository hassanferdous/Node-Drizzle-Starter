import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { app } from "./app";
import { db } from "./config/db";
import { config } from "./config";
import logger from "./lib/logger";

dotenv.config();

const PORT = config.app.port || 8000;

async function waitForDatabase(maxRetries = 5, delay = 2000) {
	logger.info("🔍 Testing database connection...");

	for (let i = 0; i < maxRetries; i++) {
		try {
			await db.execute(sql`SELECT 1`);
			logger.info("✅ Database connected successfully");
			return true;
		} catch (error) {
			logger.error(
				`❌ Database connection attempt ${i + 1}/${maxRetries} failed`
			);

			if (i === maxRetries - 1) {
				logger.error("💀 Failed to connect to database after all retries");
				throw error;
			}

			logger.info(`⏳ Retrying in ${delay / 1000} seconds...`);
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
			logger.info(`🚀 Server running on port ${PORT}`);
			logger.info(
				`📊 Health check available at: http://localhost:${PORT}/api/v1/health`
			);
		});
	} catch (error) {
		logger.error("💥 Server startup failed:", (error as Error).message);
		logger.error("🔧 Please check your database connection and try again");
		process.exit(1);
	}
}

// Handle graceful shutdown
process.on("SIGTERM", () => {
	logger.info("🛑 Received SIGTERM, shutting down gracefully...");
	process.exit(0);
});

process.on("SIGINT", () => {
	logger.info("🛑 Received SIGINT, shutting down gracefully...");
	process.exit(0);
});

// Start the server
startServer();
