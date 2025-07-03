import router from "@/api/v1/example/api";
import { Router } from "express";
export default function defineRoutes(expressRouter: Router) {
	expressRouter.use("/examples", router);
}
