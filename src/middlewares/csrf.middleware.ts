import cusrf from "csurf";
import { NextFunction, Request, Response } from "express";

// Cookie-based CSRF middleware
const csrfProtection = cusrf({
	cookie: {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production"
	}
});

export default function csrf(req: Request, res: Response, next: NextFunction) {
	const token_from_cookie = !!req.cookies.access_token;
	if (token_from_cookie) return csrfProtection(req, res, next);

	// Skip CSRF if Authorization header is present
	next();
}
