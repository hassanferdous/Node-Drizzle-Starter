import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { User } from "../../../../generated/prisma";
import { setAuthCookies, TokenOptions } from "../../../utils/cookie";
import { throwError } from "../../../utils/error";
import { generateToken, verifyToken } from "../../../utils/jwt";
import { sendSuccess } from "../../../utils/response";
import { AuthService } from "./auth.service";
export const AuthController = {
	credential: (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate(
			"local",
			{ session: false },
			async (
				err: any,
				user: User & { access_token: string; refresh_token: string },
				info: any
			) => {
				if (err) return next(err);
				if (!user) {
					throwError(info?.message || "Invalid credentials", 401);
				}
				const { access_token, refresh_token } = user;
				const tokens = { access_token, refresh_token } as TokenOptions;
				// Set tokens to the responsive cookie
				setAuthCookies(res, tokens as TokenOptions);
				// Success — you can return user data or generate JWT
				return sendSuccess(res, user, 200, "Login successful");
			}
		)(req, res, next);
	},

	// Refresh Token
	refreshToken: async (req: Request, res: Response, next: NextFunction) => {
		const cookies = req.cookies;
		const headers = req.headers;
		const token = cookies.refresh_token ?? headers["x-refresh-token"];
		if (!token) return throwError("Refresh token not found", 403);
		const [id, refresh_token] = (token as string).split("|");
		if (!id || !refresh_token)
			return throwError("Malformed refresh token", 401);
		try {
			const storedToken = await AuthService.isValidRefreshToken(
				parseInt(id)
			);
			if (!storedToken) return throwError("Refresh token not found", 403);
			const decoded = verifyToken(
				storedToken.refresh_token,
				"refresh"
			) as JwtPayload & { user: any };
			if (decoded.exp! > Date.now()) return throwError("Invalid Token", 401);
			const new_token = generateToken(decoded.user, "access");
			setAuthCookies(res, { access_token: new_token.access_token });
			return sendSuccess(
				res,
				{
					access_token: new_token.access_token,
				},
				201,
				"Successfully generated Access Token!!"
			);
		} catch (error) {
			throwError("Invalid Token", 401);
		}
	},
};
