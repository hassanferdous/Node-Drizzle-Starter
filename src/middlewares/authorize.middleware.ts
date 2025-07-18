import { createSession } from "@/domains/v1/auth/service";
import { throwError } from "@/utils/error";
import getCachedOrLoad from "@/utils/getCachedOrLoad";
import { User } from "@domains/v1/user/service";
import { NextFunction, Request, Response } from "express";
type Permisions = string[];
export default function authorize(requiredPermissions: Permisions) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user as User & { sid: string };
		const session = await getCachedOrLoad(
			user.sid,
			async () => {
				return await createSession(user);
			},
			60 * 10
		);
		const isAllowed = requiredPermissions.some((p) =>
			session.permissions.includes(p)
		);
		if (!isAllowed) throwError("Forbiden", 403);
		next();
	};
}
