import router from "@domains/v1/permission/api";
import { Router } from "express";
export default function defineRoutes(expressRouter: Router) {
	expressRouter.use("/permissions", router);
};
