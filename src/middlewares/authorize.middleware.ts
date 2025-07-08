import { User } from "@domains/v1/user/service";
import { throwError } from "@/utils/error";
import { NextFunction, Request, Response } from "express";
type Permisions = string[];
export default function authorize(permissions: Permisions) {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = req.user as User & { permissions: Permisions };
		const isAllowed = permissions.every((permission) =>
			user.permissions.includes(permission)
		);
		if (!isAllowed) {
			return throwError("Forbiden", 403);
		}
		next();
	};
}
