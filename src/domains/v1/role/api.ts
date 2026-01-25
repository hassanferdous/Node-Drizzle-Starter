import { idParamSchema } from "@/lib/common-zod-schema";
import auth from "@/middlewares/auth.middleware";
import csrfProtection from "@/middlewares/csrf.middleware";
import validate from "@/middlewares/validate.middleware";
import { AppResponse } from "@/utils/response";
import express, { Request, Response } from "express";
import { RoleServices } from "./service";
import { addPermissionSchema, createSchema } from "./validation";
import { caslAuthorize } from "@/middlewares/casl-authorize.middleware";
import { throwError } from "@/utils/error";

const router = express.Router();

// Create
router.post(
	"/",
	auth,
	// csrfProtection,
	caslAuthorize,
	validate({ body: createSchema }),
	async (req: Request, res: Response) => {
		if (!req.ability?.can("manage", "Role"))
			throwError("Forbidden.", 403, []);
		const data = await RoleServices.create(req.body);
		return AppResponse.success(
			res,
			data,
			201,
			"Successfully created new role!"
		);
	}
);

// Read all
router.get("/", auth, caslAuthorize, async (req: Request, res: Response) => {
	if (!req.ability?.can("manage", "Role")) throwError("Forbidden.", 403, []);
	const data = await RoleServices.getAll();
	return AppResponse.success(res, data, 200, "Successfully fetched all role!");
});

// Read one
router.get("/:id", auth, caslAuthorize, async (req: Request, res: Response) => {
	const id = +req.params.id;
	if (!req.ability?.can("manage", "Role")) throwError("Forbidden.", 403, []);
	const data = await RoleServices.getById(id);
	return AppResponse.success(res, data, 200, "Successfully fetched role!");
});

// Update
router.put(
	"/:id",
	validate({ body: createSchema, params: idParamSchema }),
	auth,
	caslAuthorize,
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		if (!req.ability?.can("manage", "Role"))
			throwError("Forbidden.", 403, []);
		await RoleServices.update(id, req.body);
		const data = await RoleServices.getById(id);
		return AppResponse.success(res, data, 200, "Successfully updated role!");
	}
);

// Delete
router.delete(
	"/:id",
	validate({ params: idParamSchema }),
	auth,
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		if (!req.ability?.can("manage", "Role"))
			throwError("Forbidden.", 403, []);
		const data = await RoleServices.delete(id);
		return AppResponse.success(res, data, 200, "Successfully deleted role!");
	}
);

// ********** Role Permissions ***********
// Add permissions to a role
router.post(
	"/:id/permissions",
	validate({ body: addPermissionSchema, params: idParamSchema }),
	auth,
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		if (!req.ability?.can("manage", "Role"))
			throwError("Forbidden.", 403, []);
		const data = await RoleServices.addPermissions(id, req.body.permissions);
		return AppResponse.success(
			res,
			data,
			200,
			"Permissions assigned successfully."
		);
	}
);

// Get permissions of a role
router.get(
	"/:id/permissions",
	validate({ params: idParamSchema }),
	auth,
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		if (!req.ability?.can("manage", "Role"))
			throwError("Forbidden.", 403, []);
		const data = await RoleServices.getPermissions();
		return AppResponse.success(
			res,
			data,
			200,
			"Permissions fetched successfully."
		);
	}
);

// Remove specific permissions from a role
router.delete(
	"/:id/permissions",
	validate({ body: addPermissionSchema, params: idParamSchema }),
	auth,
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		if (!req.ability?.can("manage", "Role"))
			throwError("Forbidden.", 403, []);
		await RoleServices.removePermissions(id, req.body.permissions);
		return AppResponse.success(
			res,
			{},
			200,
			"Permissions removed successfully."
		);
	}
);

// Remove ALL permissions from a role
router.delete(
	"/:id/permissions/all",
	validate({ params: idParamSchema }),
	auth,
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		if (!req.ability?.can("manage", "Role"))
			throwError("Forbidden.", 403, []);
		await RoleServices.removeAllPermissions(id);
		return AppResponse.success(
			res,
			{},
			200,
			"All permissions removed successfully."
		);
	}
);

export default router;
