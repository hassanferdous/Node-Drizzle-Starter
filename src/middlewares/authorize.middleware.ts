import { User } from "@domains/v1/user/service";
import { throwError } from "@/utils/error";
import { NextFunction, Request, Response } from "express";
import redis from "@/lib/redis";
type Permisions = string[];
export default function authorize(requiredPermissions: Permisions) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user as User & { permissionKey: string };
		const cached = await redis.get(user.permissionKey);
		if (!cached) return throwError("Forbiden", 403);
		const permissions = JSON.parse(cached);
		console.log({ permissions, requiredPermissions });
		const isAllowed = requiredPermissions.every((permission) =>
			permissions.includes(permission)
		);
		if (!isAllowed) throwError("Forbiden", 403);
		next();
	};
}
