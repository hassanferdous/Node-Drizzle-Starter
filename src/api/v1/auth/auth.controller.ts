import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { User } from "../../../../generated/prisma";
import { throwError } from "../../../utils/error";
import { generateToken } from "../../../utils/jwt";
import { sendSuccess } from "../../../utils/response";
import { setAuthCookies, TokenOptions } from "../../../utils/cookie";
export const AuthController = {
	credential: (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate(
			"local",
			{ session: false },
			(err: any, user: User, info: any) => {
				if (err) return next(err);
				if (!user) {
					throwError(info?.message || "Invalid credentials", 4001);
				}
				const tokens = generateToken(user);
				setAuthCookies(res, tokens as TokenOptions);
				// Success — you can return user data or generate JWT
				return sendSuccess(
					res,
					{ ...user, ...tokens },
					200,
					"Login successful"
				);
			}
		)(req, res, next);
	},
};
