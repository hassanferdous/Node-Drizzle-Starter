import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { throwError } from "../utils/error";
import { verifyAuthTokens } from "../utils/jwt";

export default function auth(req: Request, res: Response, next: NextFunction) {
	const cookies = req.cookies;
	const headers = req.headers;
	const access_token =
		cookies.access_token ?? headers.authorization?.replace("Bearer ", "");
	const _isCookies = !!cookies.access_token;

	try {
		const decoded = verifyAuthTokens(access_token, "access") as JwtPayload;
		const _req = req as Request & { csrf?: string; _isCookies: boolean };
		_req.user = { ...decoded.user, sid: decoded.sid };

		_req._isCookies = _isCookies;
		// Accept CSRF token from header or body
		const csrfHeader = headers["x-csrf-token"];
		const csrfBody = req.body?._csrf;

		_req.csrf =
			(Array.isArray(csrfHeader) ? csrfHeader[0] : csrfHeader) || csrfBody;
		next();
	} catch (error: any) {
		throwError(error.message || "Invalid Token", 401);
	}
}
