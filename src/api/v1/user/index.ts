import router from "@/api/v1/user/api";
import auth from "@/middlewares/auth.middleware";
import { Router } from "express";
export default function defineRoutes(expressRouter: Router) {
	expressRouter.use("/users", auth, router);
}
