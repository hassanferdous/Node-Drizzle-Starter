import { db } from "@/config/db";
import { throwError } from "@/utils/error";
import { sendSuccess } from "@/utils/response";
import authRoutes from "@domains/v1/auth";
import usersRoutes from "@domains/v1/user";
import rolesRoutes from "@domains/v1/role";
import permissionsRoutes from "@domains/v1/permission";
import { sql } from "drizzle-orm";
import { Router } from "express";
const router = Router();

function defaultRoutes(expressRouter: Router) {
	expressRouter.get("/health", async (req, res) => {
		try {
			// Check database connection
			await db.execute(sql`SELECT 1`);

			sendSuccess(
				res,
				{
					status: "healthy",
					timestamp: new Date().toISOString(),
					database: "connected"
				},
				200,
				"Service is healthy"
			);
		} catch (error) {
			res.status(503).json({
				success: false,
				status: "unhealthy",
				timestamp: new Date().toISOString(),
				database: "disconnected",
				error:
					error instanceof Error
						? error.message
						: "An unknown error occurred"
			});
		}
	});

	expressRouter.use((req, res) => {
		throwError("Route not found", 401);
	});
}

function defineRoutes(expressRouter: Router) {
	// exampleRoutes(expressRouter);
	authRoutes(expressRouter);
	usersRoutes(expressRouter);
	rolesRoutes(expressRouter);
	permissionsRoutes(expressRouter);

	// default routers
	defaultRoutes(expressRouter);
}

defineRoutes(router);

export default router;
