import { Router } from "express";
import exampleRoutes from "@/api/v1/example";
import blogRoutes from "@/api/v1/blog";
import authRoutes from "@/api/v1/auth";
import usersRoutes from "@/api/v1/user";
import { throwError } from "@/utils/error";
import { sendSuccess } from "@/utils/response";
const router = Router();

function defaultRoutes(expressRouter: Router) {
	expressRouter.get("/health", (req, res) => {
		sendSuccess(res, {}, 200, "Ok");
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
