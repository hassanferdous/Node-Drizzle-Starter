import express, { Request, Response } from "express";
import { services } from "./service";
import { sendSuccess } from "@/utils/response";
import auth from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import { createSchema, multiDeleteSchema } from "./validation";
import authorize from "@/middlewares/authorize.middleware";

const router = express.Router();

// Create
router.post(
	"/",
	auth,
	authorize(["permission:manage", "permission:create"]),
	validate({ body: createSchema }),
	async (req: Request, res: Response) => {
		const data = await services.create(req.body.permissions);
		sendSuccess(res, data, 201, "Successfully created new permission!");
	}
);

// Read all
router.get(
	"/",
	auth,
	authorize(["permission:manage", "permission:read"]),
	async (req: Request, res: Response) => {
		const data = await services.getAll();
		sendSuccess(res, data, 200, "Successfully fetched all permission!");
	}
);

// Read one
router.get(
	"/:id",
	auth,
	authorize(["permission:manage", "permission:read"]),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.getById(id);
		sendSuccess(res, data, 200, "Successfully fetched permission!");
	}
);

// Update
router.put(
	"/:id",
	auth,
	authorize(["permission:manage", "permission:update"]),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		await services.update(id, req.body);
		const data = await services.getById(id);
		sendSuccess(res, data, 200, "Successfully updated permission!");
	}
);

// Delete multiple
router.delete(
	"/",
	auth,
	authorize(["permission:manage", "permission:delete"]),
	validate({ body: multiDeleteSchema }),
	async (req: Request, res: Response) => {
		const data = await services.multiDelete(req.body.ids);
		sendSuccess(res, data, 200, "Successfully deleted permission!");
	}
);

// Delete
router.delete(
	"/:id",
	auth,
	authorize(["permission:manage", "permission:delete"]),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.delete(id);
		sendSuccess(res, data, 200, "Successfully deleted permission!");
	}
);

export default router;
