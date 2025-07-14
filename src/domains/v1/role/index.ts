import router from "@domains/v1/role/api";
import { Router } from "express";
export default function defineRoutes(expressRouter: Router) {
	expressRouter.use("/roles", router);
};
