import router from "@/api/v1/user/api";
import { Router } from "express";
export default function defineRoutes(expressRouter: Router) {
	expressRouter.use("/users", router);
}
