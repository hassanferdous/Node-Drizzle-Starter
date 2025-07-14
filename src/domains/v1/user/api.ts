import auth from "@/middlewares/auth.middleware";
import authorize from "@/middlewares/authorize.middleware";
import { sendSuccess } from "@/utils/response";
import express, { Request, Response } from "express";
import { services, User } from "./service";
import validate from "@/middlewares/validate.middleware";
import { userPermissionSchema } from "./validation";
import { idParamSchema } from "@/lib/common-zod-schema";

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
	authorize(["user:manage", "user:read"]),
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

// User's additional permissions
router.post(
	"/:id/permissions",
	auth,
	authorize(["permission:manage"]),
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.grantUserPermissions(id, req.body.permission);
		sendSuccess(res, data, 200, "Successfully granted permissions!");
	}
);
router.delete(
	"/:id/permissions",
	auth,
	authorize(["permission:manage"]),
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.deleteUserPermission(id, req.body.permission);
		sendSuccess(res, data, 200, "Successfully deleted user!");
	}
);

// User's denied permissions
router.post(
	"/:id/denied-permissions",
	auth,
	authorize(["permission:manage"]),
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.deniedUserPermissions(
			id,
			req.body.permission
		);
		sendSuccess(res, data, 200, "Successfully granted permissions!");
	}
);
router.delete(
	"/:id/denied-permissions",
	auth,
	authorize(["permission:manage"]),
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data = await services.deleteDeniedUserPermission(
			id,
			req.body.permission
		);
		sendSuccess(res, data, 200, "Successfully deleted user!");
	}
);

export default router;
