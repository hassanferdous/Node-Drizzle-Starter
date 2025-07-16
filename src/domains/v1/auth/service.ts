import { usersTable, userTokensTable } from "@/db/schema";
import { setAuthCookies, TokenOptions } from "@/utils/cookie";
import { throwError } from "@/utils/error";
import { generateToken, verifyToken } from "@/utils/jwt";
import { sendSuccess } from "@/utils/response";
import { UserServices } from "@domains/v1/user/service";
import { PermissionServices } from "@domains/v1/permission/service";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { User } from "../user/service";
import redis from "@/lib/redis";
import { db } from "@/config/db";
import { hashedPassword } from "@/utils/password-hash";

export type UserRefreshToken = InferSelectModel<typeof userTokensTable>;
export type NewRefreshToken = InferInsertModel<typeof userTokensTable>;

async function generateAccessToken(user: User) {
	const permissions = await PermissionServices.getUserPermissions(user);
	const permissionKey = `user:${user.id}:permission`;
	await redis.set(
		permissionKey,
		JSON.stringify(permissions),
		"EX",
		60 * 10 // 10min
	);
	const tokens = generateToken({
		user: { ...user, permissionKey: permissionKey }
	});
	const data = {
		user,
		...tokens,
		permissionKey: permissionKey
	};
	await UserServices.createUserRefreshToken({
		userId: user.id,
		refreshToken: tokens.refresh_token as string
	});

	return { data, tokens: tokens as TokenOptions };
}

export const AuthServices = {
	credentialLogin: (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate(
			"local",
			{ session: false },
			async (err: any, user: User, info: any) => {
				if (err) return next(err);
				if (!user) {
					throwError(info?.message || "Invalid credentials", 401);
				}
				const { data, tokens } = await generateAccessToken(user);
				setAuthCookies(res, tokens as TokenOptions);
				// Success — you can return user data or generate JWT
				return sendSuccess(res, data, 200, "Login successful");
			}
		)(req, res, next);
	},

	// Register new user
	register: async (req: Request, res: Response) => {
		const hash = await hashedPassword(req.body.password);
		const result = await db
			.insert(usersTable)
			.values({ ...req.body, password: hash })
			.returning({
				id: usersTable.id,
				email: usersTable.email,
				name: usersTable.name,
				img: usersTable.img,
				roleId: usersTable.roleId
			});

		return sendSuccess(res, result);
	},

	// Google
	callback_google: async (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate(
			"google",
			{ session: false },
			async (err, user, info) => {
				if (err) return next(err);
				if (!user) return res.redirect("/login?error=OAuthFailed");
				const { data, tokens } = await generateAccessToken(user);
				setAuthCookies(res, tokens as TokenOptions);
				return sendSuccess(res, data, 200, "Login successful");
			}
		)(req, res, next);
	},

	// verify refresh token
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
			const storedToken = await UserServices.getRefreshUserToken(
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
