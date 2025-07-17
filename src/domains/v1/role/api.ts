import express, { Request, Response } from "express";
import { RoleServices } from "./service";
import { sendSuccess } from "@/utils/response";
import auth from "@/middlewares/auth.middleware";
import authorize from "@/middlewares/authorize.middleware";
import validate from "@/middlewares/validate.middleware";
import { addPermissionSchema, createSchema } from "./validation";
import { idParamSchema } from "@/lib/common-zod-schema";
import csrf from "@/middlewares/csrf.middleware";

const router = express.Router();

// Create
router.post(
	"/",
	auth,
	csrf,
	authorize(["role:manage"]),
	validate({ body: createSchema }),
	async (req: Request, res: Response) => {
		const data = await RoleServices.create(req.body);
		sendSuccess(res, data, 201, "Successfully created new role!");
	}
);

// Read all
router.get(
	"/",
	auth,
	authorize(["role:manage"]),
	async (req: Request, res: Response) => {
		const data = await RoleServices.getAll();
		sendSuccess(res, data, 200, "Successfully fetched all role!");
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
		sendSuccess(res, data, 200, "Successfully fetched role!");
	}
);

// Update
router.put(
	"/:id",
	auth,
	csrf,
	authorize(["role:manage"]),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		await RoleServices.update(id, req.body);
		const data = await RoleServices.getById(id);
		sendSuccess(res, data, 200, "Successfully updated role!");
	}
);

// Delete
router.delete(
	"/:id",
	auth,
	csrf,
	authorize(["role:manage"]),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await RoleServices.delete(id);
		sendSuccess(res, data, 200, "Successfully deleted role!");
	}
);

// ********** Role Permissions ***********
// Add permissions to a role
router.post(
	"/:id/permissions",
	auth,
	csrf,
	authorize(["role:manage"]),
	validate({ body: addPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await RoleServices.addPermissions(id, req.body.permissions);
		sendSuccess(res, data, 200, "Permissions assigned successfully.");
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
		sendSuccess(res, data, 200, "Permissions fetched successfully.");
	}
);

// Remove specific permissions from a role
router.delete(
	"/:id/permissions",
	auth,
	csrf,
	authorize(["role:manage"]),
	validate({ body: addPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		await RoleServices.removePermissions(id, req.body.permissions);
		sendSuccess(res, {}, 200, "Permissions removed successfully.");
	}
);

// Remove ALL permissions from a role
router.delete(
	"/:id/permissions/all",
	auth,
	csrf,
	authorize(["role:manage"]),
	validate({ params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		await RoleServices.removeAllPermissions(id);
		sendSuccess(res, {}, 200, "All permissions removed successfully.");
	}
);

export default router;
