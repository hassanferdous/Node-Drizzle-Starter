import { idParamSchema } from "@/lib/common-zod-schema";
import auth from "@/middlewares/auth.middleware";
import authorize from "@/middlewares/authorize.middleware";
import csrfProtection from "@/middlewares/csrf.middleware";
import validate from "@/middlewares/validate.middleware";
import { AppResponse } from "@/utils/response";
import express, { Request, Response } from "express";
import { RoleServices } from "./service";
import { addPermissionSchema, createSchema } from "./validation";

const router = express.Router();

// Create
router.post(
	"/",
	auth,
	csrfProtection,
	authorize(["role:manage"]),
	validate({ body: createSchema }),
	async (req: Request, res: Response) => {
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
router.get(
	"/",
	auth,
	authorize(["role:manage"]),
	async (req: Request, res: Response) => {
		const data = await RoleServices.getAll();
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully fetched all role!"
		);
	}
);

// Read one
router.get(
	"/:id",
	auth,
	authorize(["role:manage"]),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await RoleServices.getById(id);
		return AppResponse.success(res, data, 200, "Successfully fetched role!");
	}
);

// Update
router.put(
	"/:id",
	auth,
	csrfProtection,
	authorize(["role:manage"]),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		await RoleServices.update(id, req.body);
		const data = await RoleServices.getById(id);
		return AppResponse.success(res, data, 200, "Successfully updated role!");
	}
);

// Delete
router.delete(
	"/:id",
	auth,
	csrfProtection,
	authorize(["role:manage"]),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await RoleServices.delete(id);
		return AppResponse.success(res, data, 200, "Successfully deleted role!");
	}
);

// ********** Role Permissions ***********
// Add permissions to a role
router.post(
	"/:id/permissions",
	auth,
	csrfProtection,
	authorize(["role:manage"]),
	validate({ body: addPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
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
	auth,
	authorize(["role:manage"]),
	validate({ params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await RoleServices.getPermissions(id);
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
	auth,
	csrfProtection,
	authorize(["role:manage"]),
	validate({ body: addPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
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
	auth,
	csrfProtection,
	authorize(["role:manage"]),
	validate({ params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
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
