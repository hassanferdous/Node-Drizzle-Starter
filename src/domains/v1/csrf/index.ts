import csrf from "@/middlewares/csrf.middleware";
import router from "@domains/v1/csrf/api";
import { Router } from "express";
export default function defineRoutes(expressRouter: Router) {
	expressRouter.use("/csrf-token", csrf, router);
}
