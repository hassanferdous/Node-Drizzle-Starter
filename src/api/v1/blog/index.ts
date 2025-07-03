import router from "@/api/v1/blog/api";
import { Router } from "express";
export default function defineRoutes(expressRouter: Router) {
	expressRouter.use("/blogs", router);
};
