import auth from "@/middlewares/auth.middleware";
import { caslAuthorize } from "@/middlewares/casl-authorize.middleware";
import validate from "@/middlewares/validate.middleware";
import { throwError } from "@/utils/error";
import { AppResponse } from "@/utils/response";
import express, { Request, Response } from "express";
import { PermissionServices } from "./service";
import { createSchema, multiDeleteSchema } from "./validation";

const router = express.Router();

// Create
router.post(
	"/",
	validate({ body: createSchema }),
	auth,
	caslAuthorize,
	async (req: Request, res: Response) => {
		if (!req.ability?.can("manage", "Permission"))
			throwError("Forbidden.", 403, []);
		const data = await PermissionServices.create(req.body.permissions);
		return AppResponse.success(
			res,
			data,
			201,
			"Successfully created new permission!"
		);
	}
);

// Read all
router.get("/", auth, caslAuthorize, async (req: Request, res: Response) => {
	if (!req.ability?.can("manage", "Permission"))
		throwError("Forbidden.", 403, []);
	const data = await PermissionServices.getAll();
	return AppResponse.success(
		res,
		data,
		200,
		"Successfully fetched all permission!"
	);
});

// Read one
router.get("/:id", auth, caslAuthorize, async (req: Request, res: Response) => {
	if (!req.ability?.can("manage", "Permission"))
		throwError("Forbidden.", 403, []);
	const id = +req.params.id;
	const data = await PermissionServices.getById(id);
	return AppResponse.success(
		res,
		data,
		200,
		"Successfully fetched permission!"
	);
});

// Update
router.put("/:id", auth, caslAuthorize, async (req: Request, res: Response) => {
	const id = +req.params.id;
	if (!req.ability?.can("manage", "Permission"))
		throwError("Forbidden.", 403, []);
	await PermissionServices.update(id, req.body);
	const data = await PermissionServices.getById(id);
	return AppResponse.success(
		res,
		data,
		200,
		"Successfully updated permission!"
	);
});

// Delete multiple
router.delete(
	"/",
	validate({ body: multiDeleteSchema }),
	auth,
	caslAuthorize,
	async (req: Request, res: Response) => {
		if (!req.ability?.can("manage", "Permission"))
			throwError("Forbidden.", 403, []);
		const data = await PermissionServices.multiDelete(req.body.ids);
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully deleted permission!"
		);
	}
);

// Delete
router.delete(
	"/:id",
	auth,
	caslAuthorize,
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		if (!req.ability?.can("manage", "Permission"))
			throwError("Forbidden.", 403, []);
		const data = await PermissionServices.delete(id);
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully deleted permission!"
		);
	}
);

export default router;
