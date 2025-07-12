"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const error_1 = require("../utils/error");
const response_1 = require("../utils/response");
const auth_1 = __importDefault(require("../domains/v1/auth"));
const user_1 = __importDefault(require("../domains/v1/user"));
const drizzle_orm_1 = require("drizzle-orm");
const express_1 = require("express");
const router = (0, express_1.Router)();
function defaultRoutes(expressRouter) {
    expressRouter.get("/health", async (req, res) => {
        try {
            // Check database connection
            await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT 1`);
            (0, response_1.sendSuccess)(res, {
                status: "healthy",
                timestamp: new Date().toISOString(),
                database: "connected"
            }, 200, "Service is healthy");
        }
        catch (error) {
            res.status(503).json({
                success: false,
                status: "unhealthy",
                timestamp: new Date().toISOString(),
                database: "disconnected",
                error: error instanceof Error
                    ? error.message
                    : "An unknown error occurred"
            });
        }
    });
    expressRouter.use((req, res) => {
        (0, error_1.throwError)("Route not found", 401);
    });
}
function defineRoutes(expressRouter) {
    // exampleRoutes(expressRouter);
    (0, auth_1.default)(expressRouter);
    (0, user_1.default)(expressRouter);
    // default routers
    defaultRoutes(expressRouter);
}
defineRoutes(router);
exports.default = router;
