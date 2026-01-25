import { db } from "@/config/db";
import { user_roles } from "@/db/schema";
import { idParamSchema } from "@/lib/common-zod-schema";
import auth from "@/middlewares/auth.middleware";
import { caslAuthorize } from "@/middlewares/casl-authorize.middleware";
import csrfProtection from "@/middlewares/csrf.middleware";
import validate from "@/middlewares/validate.middleware";
import { CaslAbility } from "@/types/index";
import { throwError } from "@/utils/error";
import { AppResponse } from "@/utils/response";
import express, { Request, Response } from "express";
import { UserServices } from "./service";
import {
	assignRoleSchema,
	createSchema,
	updateSchema,
	userPermissionSchema
} from "./validation";

const router = express.Router();

// Create
router.post(
	"/",
	auth,
	csrfProtection,
	caslAuthorize,
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
router.get("/", auth, caslAuthorize, async (req: Request, res: Response) => {
	if (!req.ability?.can("list", "User")) throwError("Forbidden.", 403, []);
	const data = await UserServices.getAll();
	return AppResponse.success(res, data, 200, "Successfully fetched all user!");
});

// Profile
router.get(
	"/profile",
	auth,
	caslAuthorize,
	async (req: Request, res: Response) => {
		const user = req.user as { id: number };
		if (!req.ability?.can("read", { resource: "User", id: user.id }))
			throwError("Forbidden.", 403, []);
		const data = await UserServices.getById(user.id);
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully fetched profile."
		);
	}
);

// Read one
router.get(
	"/:id",
	auth,
	validate({ params: idParamSchema }),
	caslAuthorize,
	async (req: Request & { ability?: CaslAbility }, res: Response) => {
		const id = +req.params.id;
		if (!req.ability?.can("read", { resource: "User", id }))
			throwError("Forbidden.", 403, []);
		const data = await UserServices.getById(id);
		return AppResponse.success(res, data, 200, "Successfully fetched user!");
	}
);

// Update
router.put(
	"/:id",
	validate({ body: updateSchema, params: idParamSchema }),
	auth,
	caslAuthorize,
	csrfProtection,
	async (req: Request & { ability?: CaslAbility }, res: Response) => {
		const id = +req.params.id;
		if (!req.ability?.can("update", { resource: "User", id }))
			throwError("Forbidden.", 403, []);
		const data = await UserServices.update(id, req.body);
		return AppResponse.success(res, data, 200, "Successfully updated user!");
	}
);

// Delete
router.delete(
	"/:id",
	validate({ params: idParamSchema }),
	auth,
	caslAuthorize,
	csrfProtection,
	async (req: Request & { ability?: CaslAbility }, res: Response) => {
		const id = +req.params.id;
		if (!req.ability?.can("delete", { resource: "User", id }))
			throwError("Forbidden.", 403, []);
		const data = await UserServices.delete(id);
		return AppResponse.success(res, data, 200, "Successfully deleted user!");
	}
);

/************ User role permission  *********/
router.get(
	"/:id/role-permissions",
	validate({ params: idParamSchema }),
	auth,
	caslAuthorize,
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

/************ User denied permissions  *********/
router.post(
	"/:id/denied-permissions",
	auth,
	csrfProtection,
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data: any = [];
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully denied role permissions!"
		);
	}
);

router.delete(
	"/:id/denied-permissions",
	auth,
	csrfProtection,
	validate({ body: userPermissionSchema, params: idParamSchema }),
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const data: any = {};
		return AppResponse.success(
			res,
			data,
			200,
			"Successfully deleted denied permissions!"
		);
	}
);

router.post(
	"/:id/assign-role",
	validate({ body: assignRoleSchema, params: idParamSchema }),
	auth,
	caslAuthorize,
	// csrfProtection,
	async (req: Request, res: Response) => {
		const id = +req.params.id;
		const values = req.body.role.map((role: number) => ({
			userId: id,
			roleId: role,
			scopeType: "global",
			scopeId: null
		}));
		if (!req.ability?.can("manage", "User"))
			throwError("Forbidden.", 403, []);
		await db.insert(user_roles).values(values);
		return AppResponse.success(res, [], 200, "Successfully assigned role!");
	}
);

export default router;
