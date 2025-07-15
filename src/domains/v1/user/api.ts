import auth from "@/middlewares/auth.middleware";
import authorize from "@/middlewares/authorize.middleware";
import { sendSuccess } from "@/utils/response";
import express, { Request, Response } from "express";
import { services, User } from "./service";
import validate from "@/middlewares/validate.middleware";
import { updateSchema, userPermissionSchema } from "./validation";
import { idParamSchema } from "@/lib/common-zod-schema";

const router = express.Router();

// Create
router.post(
	"/",
	auth,
	authorize(["user:manage", "user:create"]),
	async (req: Request, res: Response) => {
		const data = await services.create(req.body);
		sendSuccess(res, data, 201, "Successfully created new user!");
	}
);

// Read all
router.get(
	"/",
	auth,
	authorize(["user:manage", "user:read"]),
	async (req: Request, res: Response) => {
		const data = await services.getAll();
		sendSuccess(res, data, 200, "Successfully fetched all user!");
	}
);

// Read one
router.get(
	"/:id",
	auth,
	authorize(["user:manage", "user:read"]),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.getById(id);
		sendSuccess(res, data, 200, "Successfully fetched user!");
	}
);

// Update
router.put(
	"/:id",
	auth,
	authorize(["user:manage", "user:update"]),
	validate({ body: updateSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.update(id, req.body);
		sendSuccess(res, data, 200, "Successfully updated user!");
	}
);

// Delete
router.delete(
	"/:id",
	auth,
	authorize(["user:manage", "user:delete"]),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.delete(id);
		sendSuccess(res, data, 200, "Successfully deleted user!");
	}
);

// User role permission
router.get("/:id/role-permissions", async (req: Request, res: Response) => {
	const id = +req.params.id;
	const data = await services.getUserRolePermissions(id);
	sendSuccess(res, data, 200, "Successfully fetched user!");
});

// User additional permissions
router.post(
	"/:id/additional-permissions",
	auth,
	authorize(["permission:manage"]),
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.grantAdditionalPermission(
			id,
			req.body.permission
		);
		sendSuccess(res, data, 200, "Successfully granted permissions!");
	}
);
router.get(
	"/:id/additional-permissions",
	auth,
	authorize(["permission:manage"]),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.getAdditionalPermission(id);
		sendSuccess(res, data, 200, "Successfully fetched granted permissions!");
	}
);
router.delete(
	"/:id/additional-permissions",
	auth,
	authorize(["permission:manage"]),
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.deleteAdditionalPermission(
			id,
			req.body.permission
		);
		sendSuccess(res, data, 200, "Successfully deleted granted permissions!");
	}
);

// User denied permissions
router.post(
	"/:id/denied-permissions",
	auth,
	authorize(["permission:manage"]),
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.deniedPermission(id, req.body.permission);
		sendSuccess(res, data, 200, "Successfully denied role permissions!");
	}
);
router.get(
	"/:id/denied-permissions",
	auth,
	authorize(["permission:manage"]),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.getDeniedPermission(id);
		sendSuccess(res, data, 200, "Successfully fetced denied permissions!");
	}
);
router.delete(
	"/:id/denied-permissions",
	auth,
	authorize(["permission:manage"]),
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.deleteDeniedPermission(
			id,
			req.body.permission
		);
		sendSuccess(res, data, 200, "Successfully deleted denied permissions!");
	}
);

export default router;
