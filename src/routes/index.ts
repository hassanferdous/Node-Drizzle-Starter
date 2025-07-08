import { Router } from "express";
import exampleRoutes from "@/api/v1/example";
import blogRoutes from "@/api/v1/blog";
import authRoutes from "@/api/v1/auth";
import usersRoutes from "@/api/v1/user";
const router = Router();

function defineRoutes(expressRouter: Router) {
	// exampleRoutes(expressRouter);
	authRoutes(expressRouter);
	usersRoutes(expressRouter);
	blogRoutes(expressRouter);
}

defineRoutes(router);

export default router;
