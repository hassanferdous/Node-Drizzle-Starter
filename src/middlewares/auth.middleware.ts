import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { throwError } from "../utils/error";
import { JwtPayload } from "jsonwebtoken";

export default function auth(req: Request, res: Response, next: NextFunction) {
	const cookies = req.cookies;
	const headers = req.headers;
	const access_token =
		cookies.access_token ?? headers.authorization?.replace("Bearer ", "");
	try {
		const decoded = verifyToken(access_token, "access") as JwtPayload;
		req.user = decoded.user;
		next();
	} catch (error) {
		throwError("Invalid Token", 401);
	}
}
