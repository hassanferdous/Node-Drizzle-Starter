import { Router } from "express";
import exampleRoutes from "@/api/v1/example";
import blogRoutes from "@/api/v1/blog";
import authRoutes from "@/api/v1/auth";
const router = Router();

function defineRoutes(expressRouter: Router) {
	// exampleRoutes(expressRouter);
	authRoutes(expressRouter);
	blogRoutes(expressRouter);
}

defineRoutes(router);

export default router;
