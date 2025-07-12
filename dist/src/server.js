"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const drizzle_orm_1 = require("drizzle-orm");
const app_1 = require("./app");
const db_1 = require("./config/db");
const config_1 = require("./config");
dotenv_1.default.config();
const PORT = config_1.config.app.port || 5001;
async function waitForDatabase(maxRetries = 5, delay = 2000) {
    console.log("🔍 Testing database connection...");
    for (let i = 0; i < maxRetries; i++) {
        try {
            await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT 1`);
            console.log("✅ Database connected successfully");
            return true;
        }
        catch (error) {
            console.log(`❌ Database connection attempt ${i + 1}/${maxRetries} failed`);
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
        app_1.app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Health check available at: http://localhost:${PORT}/api/v1/health`);
        });
    }
    catch (error) {
        console.error("💥 Server startup failed:", error.message);
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
