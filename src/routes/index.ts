import { Router } from "express";
import exampleRoutes from "@domains/v1/example";
import blogRoutes from "@domains/v1/blog";
import authRoutes from "@domains/v1/auth";
import usersRoutes from "@domains/v1/user";
import { throwError } from "@/utils/error";
import { sendSuccess } from "@/utils/response";
import { db } from "@/config/db";
import { usersTable } from "@/db/schema";
const router = Router();

function defaultRoutes(expressRouter: Router) {
	expressRouter.get("/health", async (req, res) => {
		try {
			// Check database connection
			await db.select().from(usersTable).limit(1);

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
	blogRoutes(expressRouter);

	// default routers
	defaultRoutes(expressRouter);
}

defineRoutes(router);

export default router;
