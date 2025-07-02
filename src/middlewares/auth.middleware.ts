import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { throwError } from "../utils/error";

export default function verifyAuth(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const cookies = req.cookies;
	const headers = req.headers;
	const access_token =
		cookies.access_token ?? headers.authorization?.replace("Bearer ", "");
	try {
		verifyToken(access_token, "access");
		next();
	} catch (error) {
		throwError("Invalid Token", 401);
	}
}
