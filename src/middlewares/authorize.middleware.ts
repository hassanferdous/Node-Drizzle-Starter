import { throwError } from "@/utils/error";
import getCachedOrLoad from "@/utils/getCachedOrLoad";
import { User } from "@domains/v1/user/service";
import { services as permissionServies } from "@domains/v1/permission/service";
import { NextFunction, Request, Response } from "express";
type Permisions = string[];
export default function authorize(requiredPermissions: Permisions) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user as User & { permissionKey: string };
		const permissions = await getCachedOrLoad(
			user.permissionKey,
			async () => {
				return await permissionServies.getUserPermissions(user);
			},
			60 * 10
		);
		const isAllowed = requiredPermissions.some((permission) =>
			permissions.includes(permission)
		);
		if (!isAllowed) throwError("Forbiden", 403);
		next();
	};
}
