import express, { Request, Response } from "express";
import { services } from "./service";
import { sendSuccess } from "@/utils/response";
import auth from "@/middlewares/auth.middleware";
import authorize from "@/middlewares/authorize.middleware";

const router = express.Router();

// Create
router.post(
	"/",
	auth,
	authorize(["create_user"]),
	async (req: Request, res: Response) => {
		const data = await services.create(req.body);
		sendSuccess(res, data, 201, "Successfully created new user!");
	}
);

// Read all
router.get(
	"/",
	auth,
	authorize(["create_user"]),
	async (req: Request, res: Response) => {
		const data = await services.getAll();
		sendSuccess(res, data, 200, "Successfully fetched all user!");
	}
);

// Read one
router.get("/:id", async (req: Request, res: Response) => {
	const id = +req.params.id;
	const data = await services.getById(id);
	sendSuccess(res, data, 200, "Successfully fetched user!");
});

// Update
router.put("/:id", async (req: Request, res: Response) => {
	const id = +req.params.id;
	await services.update(id, req.body);
	const data = await services.getById(id);
	sendSuccess(res, data, 200, "Successfully updated user!");
});

// Delete
router.delete("/:id", async (req: Request, res: Response) => {
	const id = +req.params.id;
	const data = await services.delete(id);
	sendSuccess(res, data, 200, "Successfully deleted user!");
});

export default router;
