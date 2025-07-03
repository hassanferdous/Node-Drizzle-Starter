import router from "@/api/v1/auth/api";
import { Router } from "express";
export default function defineRoutes(expressRouter: Router) {
	expressRouter.use("/auth", router);
}
