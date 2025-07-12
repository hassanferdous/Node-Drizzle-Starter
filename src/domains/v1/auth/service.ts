import { userTokensTable } from "@/db/schema";
import { setAuthCookies, TokenOptions } from "@/utils/cookie";
import { throwError } from "@/utils/error";
import { generateToken, verifyToken } from "@/utils/jwt";
import { sendSuccess } from "@/utils/response";
import { services as userServies } from "@domains/v1/user/service";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { User } from "../user/service";

export type UserRefreshToken = InferSelectModel<typeof userTokensTable>;
export type NewRefreshToken = InferInsertModel<typeof userTokensTable>;

export const services = {
	credentialLogin: (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate(
			"local",
			{ session: false },
			async (err: any, user: User, info: any) => {
				if (err) return next(err);
				if (!user) {
					throwError(info?.message || "Invalid credentials", 401);
				}
				const permissions = await userServies.getPermissionsByRoleId(
					user.roleId as number
				);
				const userWithPermision = { ...user, permissions };
				const tokens = generateToken({ user: userWithPermision });
				setAuthCookies(res, tokens as TokenOptions);
				const responseData = {
					user: userWithPermision,
					...tokens
				};
				await userServies.createRefreshUserToken({
					userId: user.id,
					refreshToken: tokens.refresh_token as string
				});

				// Success — you can return user data or generate JWT
				return sendSuccess(res, responseData, 200, "Login successful");
			}
		)(req, res, next);
	},

	verfifyRefreshToken: async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const cookies = req.cookies;
		const headers = req.headers;
		const token = cookies.refresh_token ?? headers["x-refresh-token"];
		if (!token) return throwError("Refresh token not found", 403);
		const refresh_token = token as string;
		if (!refresh_token) return throwError("Malformed refresh token", 401);
		try {
			const decodeded = verifyToken(token, "refresh") as JwtPayload & {
				user: User;
			};
			if (decodeded.exp! > Date.now())
				return throwError("Invalid Token", 401);
			const storedToken = await userServies.getRefreshUserToken(
				decodeded.user.id
			);
			if (!storedToken) return throwError("Refresh token not found", 403);
			const new_token = generateToken({ user: decodeded.user }, "access");
			setAuthCookies(res, { access_token: new_token.access_token });
			return sendSuccess(
				res,
				{
					access_token: new_token.access_token
				},
				201,
				"Successfully generated Access Token!!"
			);
		} catch (error) {
			throwError("Invalid Token", 401);
		}
	}
};
