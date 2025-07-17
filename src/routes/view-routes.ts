import { Request, Response, Router } from "express";
const router = Router();

function defaultRoutes(router: Router) {
	router.get("/", (req: Request, res: Response) => {
		res.render("index");
	});
	router.get("/login-success", (req: Request, res: Response) => {
		res.render("login-success");
	});
}

function defineRoutes(expressRouter: Router) {
	// default routers
	defaultRoutes(expressRouter);
}

defineRoutes(router);

export default router;
