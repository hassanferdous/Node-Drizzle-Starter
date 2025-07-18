import redis from "@/lib/redis";
import { throwError } from "@/utils/error";
import { NextFunction, Request, Response } from "express";
import { Session } from "..";

export default async function csrfProtection(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const _req = req as Request & { csrf?: string; _isCookies: boolean };
	const isCookies = !!_req._isCookies;
	const user = req.user as Express.User & { sid: string };
	if (!isCookies) return next();
	// Check if the csrf token is valid and present
	const cached = await redis.get(user?.sid);
	if (!cached) return throwError("Session expired", 403);
	const session = JSON.parse(cached) as Session;
	if (session.csrf !== _req.csrf) return throwError("Invalid CSRF token", 403);
	next();
}
