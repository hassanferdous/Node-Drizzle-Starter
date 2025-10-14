import { idParamSchema } from "@/lib/common-zod-schema";
import auth from "@/middlewares/auth.middleware";
import authorize from "@/middlewares/authorize.middleware";
import csrfProtection from "@/middlewares/csrf.middleware";
import validate from "@/middlewares/validate.middleware";
import { AppResponse } from "@/utils/response";
import express, { Request, Response } from "express";
import { UserServices } from "./service";
import { createSchema, updateSchema, userPermissionSchema } from "./validation";

const router = express.Router();

// Create
router.post(
	"/",
	auth,
	csrfProtection,
	authorize(["user:manage", "user:create"]),
	validate({ body: createSchema }),
	async (req: Request, res: Response) => {
		const data = await UserServices.create(req.body);
		return AppResponse.success(
			res,
			data,
			201,
			"Successfully created new user!"
		);
	}
);

// Read all
router.get(
	"/",
	auth,
	authorize(["user:manage", "user:read"]),
	async (req: Request, res: Response) => {
		const data = await UserServices.getAll();
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully fetched all user!"
		);
	}
);

// Profile
router.get("/profile", auth, async (req: Request, res: Response) => {
	const user = req.user as { id: number };
	const data = await UserServices.getById(user.id);
	return AppResponse.success(res, data, 200, "Successfully fetched profile.");
});

// Read one
router.get(
	"/:id",
	auth,
	authorize(["user:manage", "user:read"]),
	validate({ params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await UserServices.getById(id);
		return AppResponse.success(res, data, 200, "Successfully fetched user!");
	}
);

// Update
router.put(
	"/:id",
	auth,
	csrfProtection,
	authorize(["user:manage", "user:update"]),
	validate({ body: updateSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await UserServices.update(id, req.body);
		return AppResponse.success(res, data, 200, "Successfully updated user!");
	}
);

// Delete
router.delete(
	"/:id",
	auth,
	csrfProtection,
	authorize(["user:manage", "user:delete"]),
	validate({ params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await UserServices.delete(id);
		return AppResponse.success(res, data, 200, "Successfully deleted user!");
	}
);

/************ User role permission  *********/
router.get(
	"/:id/role-permissions",
	auth,
	authorize(["permission:manage"]),
	validate({ params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await UserServices.getUserRolePermissions(id);
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully fetched user's role-permissions'!"
		);
	}
);

/************ User additional permissions  *********/
router.post(
	"/:id/additional-permissions",
	auth,
	csrfProtection,
	authorize(["permission:manage"]),
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await UserServices.grantAdditionalPermission(
			id,
			req.body.permission
		);
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully granted permissions!"
		);
	}
);
router.get(
	"/:id/additional-permissions",
	auth,
	authorize(["permission:manage"]),
	validate({ params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await UserServices.getAdditionalPermission(id);
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully fetched granted permissions!"
		);
	}
);
router.delete(
	"/:id/additional-permissions",
	auth,
	csrfProtection,
	authorize(["permission:manage"]),
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await UserServices.deleteAdditionalPermission(
			id,
			req.body.permission
		);
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully deleted granted permissions!"
		);
	}
);

/************ User denied permissions  *********/
router.post(
	"/:id/denied-permissions",
	auth,
	csrfProtection,
	authorize(["permission:manage"]),
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await UserServices.deniedPermission(id, req.body.permission);
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully denied role permissions!"
		);
	}
);
router.get(
	"/:id/denied-permissions",
	auth,
	authorize(["permission:manage"]),
	validate({ params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await UserServices.getDeniedPermission(id);
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully fetced denied permissions!"
		);
	}
);
router.delete(
	"/:id/denied-permissions",
	auth,
	csrfProtection,
	authorize(["permission:manage"]),
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await UserServices.deleteDeniedPermission(
			id,
			req.body.permission
		);
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully deleted denied permissions!"
		);
	}
);

export default router;
