import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { User } from "../../../../generated/prisma";
import { setAuthCookies, TokenOptions } from "../../../utils/cookie";
import { throwError } from "../../../utils/error";
import { sendSuccess } from "../../../utils/response";
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
};
