import { config } from "@/config";
import { db } from "@/config/db";
import { usersTable, userTokensTable } from "@/db/schema";
import { generateOTP, verifyOTP } from "@/lib/otp";
import redis from "@/lib/redis";
import { emailWorker } from "@/queues/email";
import { AuthUser } from "@/types/index";
import { clearAuthCookies, setAuthCookies, TokenOptions } from "@/utils/cookie";
import { AppError, throwError } from "@/utils/error";
import {
	generateAuthTokens,
	generateToken,
	verifyAuthTokens,
	verifyToken
} from "@/utils/jwt";
import { hashedPassword } from "@/utils/password-hash";
import { AppResponse } from "@/utils/response";
import { UserServices } from "@domains/v1/user/service";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { v4 as uuidv4 } from "uuid";
import { User } from "../user/service";
import { interpolate } from "@/utils/interpolate";

export type UserRefreshToken = InferSelectModel<typeof userTokensTable>;
export type NewRefreshToken = InferInsertModel<typeof userTokensTable>;

export async function createSession(authUser: AuthUser) {
	const sid = `session:user:${authUser.id}`;
	let { permissions, roles, ...user } = authUser;
	const csrf = uuidv4();
	permissions = permissions.map((permission) => ({
		...permission,
		conditions: interpolate(permission.conditions as unknown as string, {
			user
		})
	}));
	await redis.set(
		sid,
		JSON.stringify({
			csrf,
			permissions,
			userId: user.id,
			roles
		}),
		"EX",
		parseInt(config.auth.accessTokenDuration)
	);
	return { csrf, permissions, sid, roles, user };
}

// Generate access token
async function generateUserTokens(authUser: AuthUser) {
	const { csrf, sid, permissions, roles, user } =
		await createSession(authUser);

	const tokens = generateAuthTokens({
		user: { id: user.id, email: user.email },
		sid: sid
	});

	// create user session in dbs
	await UserServices.createUserSessionDB({
		userId: user.id,
		refreshToken: tokens.refresh_token as string,
		expires_at: new Date(Date.now() + 60 * 60 * 1000 * 24) // 1day
	});

	const data = {
		user: {
			id: user.id,
			email: user.email,
			roles,
			permissions
		},
		...tokens,
		csrf
	};

	return { data, tokens: { ...tokens, csrf } as TokenOptions };
}

// Generate one time code and return redirect url
async function generateOneTimeCode(user: AuthUser) {
	const { data, tokens } = await generateUserTokens(user);
	const oneTimeCode = uuidv4();
	const cacheKey = `auth:code:${oneTimeCode}`;
	await redis.set(
		cacheKey,
		JSON.stringify({ ...tokens, userId: user.id }),
		"EX",
		60 * 2 // Expires in 2 minutes
	);
	return { data, tokens, redirectUrl: `/login-success?code=${oneTimeCode}` };
}

export const AuthServices = {
	callback_credential: (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate(
			"local",
			{ session: false },
			async (err: any, user: AuthUser, info: any) => {
				if (err || !user) next(new AppError("Invalid credentials", 401));
				const { data, tokens } = await generateUserTokens(user);
				setAuthCookies(res, tokens as TokenOptions);
				// Success — you can return user data or generate JWT
				return AppResponse.success(res, data, 200, "Login successful");
			}
		)(req, res, next);
	},

	callback_google: async (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate(
			"google",
			{ session: false },
			async (err, user: AuthUser, info) => {
				if (err) return next(err);
				if (!user) return res.redirect("/login?error=OAuthFailed");
				const { tokens, redirectUrl } = await generateOneTimeCode(user);
				setAuthCookies(res, tokens as TokenOptions);
				return res.redirect(redirectUrl);
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
			const decodeded = verifyAuthTokens(token, "refresh") as JwtPayload & {
				user: AuthUser;
			};
			if (decodeded.exp! > Date.now())
				return throwError("Invalid Token", 401);
			const storedToken = await UserServices.getUserRefreshToken(
				decodeded.user.id
			);
			if (!storedToken) return throwError("Refresh token not found", 403);
			const new_token = generateAuthTokens(
				{ user: decodeded.user },
				"access"
			);
			setAuthCookies(res, { access_token: new_token.access_token });
			const { csrf, sid, permissions } = await createSession(decodeded.user);

			return AppResponse.success(
				res,
				{
					access_token: new_token.access_token,
					csrf,
					sid
				},
				201,
				"Successfully generated Access Token!!"
			);
		} catch (error) {
			throwError("Invalid Token", 401);
		}
	},

	exchangeToken: async (req: Request, res: Response) => {
		const code = req.query.code;
		const cached = await redis.get(`auth:code:${code}`);
		if (!cached) return throwError("Invalid or expired code", 400);
		await redis.del(`auth:code:${code}`);
		return AppResponse.success(res, JSON.parse(cached), 200);
	},

	register: async (req: Request, res: Response) => {
		const hash = await hashedPassword(req.body.password);
		const result = await db
			.insert(usersTable)
			.values({ ...req.body, password: hash })
			.returning({
				id: usersTable.id,
				email: usersTable.email,
				name: usersTable.name,
				img: usersTable.img
			});

		return AppResponse.success(res, result[0]);
	},

	forgotPassword: async (req: Request, res: Response) => {
		const user = await UserServices.getByEmail(req.body.email);
		if (!user)
			return AppResponse.success(
				res,
				{},
				200,
				"If the email exists, OTP has been sent."
			);
		const otp = generateOTP();
		await emailWorker.send({
			subject: "🔐 Password Reset Code",
			to: config.smtp.SMTP_USER,
			html: `
				<div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
					<h2 style="color: #4CAF50;">Password Reset Request</h2>
					<p>Hello,</p>
					<p>You requested to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
					<div style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px; width: 200px; margin: 20px auto;">
					${otp}
					</div>
					<p><strong>This code will expire in 3 minutes.</strong></p>
					<p>If you did not request this, please ignore this email.</p>
					<hr style="margin-top: 30px;" />
					<p style="font-size: 12px; color: #888;">Thank you,<br />The YourApp Team</p>
				</div>
			`
		});
		return AppResponse.success(
			res,
			{},
			200,
			"Sent OTP successfully. Please check your email"
		);
	},

	verifyOTPHandler: async (req: Request, res: Response) => {
		const { email, otp } = req.body;
		const user = await UserServices.getByEmail(email);
		if (!user) return throwError("Invalid OTP or User doesn't exist");
		const isValid = await verifyOTP(user.id!, otp);

		if (!isValid) throwError("Invalid OTP");
		const resetToken = generateToken(
			{ email: user.email, id: user.id, purpose: "reset-password" },
			{
				expiresIn: "5m",
				secret: config.auth.jwtAccessTokenSecret
			}
		);
		return AppResponse.success(
			res,
			{ token: resetToken },
			200,
			"OTP verfication has been succesful"
		);
	},

	resetPassword: async (req: Request, res: Response) => {
		const { newPassword, token } = req.body;
		const decoded = verifyToken(token, config.auth.jwtAccessTokenSecret);
		if (!decoded) return throwError("Invaild or Expired token");
		const { id } = decoded as unknown as User;
		const hash = await hashedPassword(newPassword);
		await UserServices.update(id, { password: hash as string });
		return AppResponse.success(
			res,
			{},
			200,
			"Successful! Please login with your new password"
		);
	},

	logout: async (req: Request, res: Response) => {
		const token =
			req.cookies.refresh_token ??
			(req.headers["x-refresh-token"] as string | undefined);

		if (token) {
			try {
				const decoded = verifyAuthTokens(token, "refresh") as JwtPayload & {
					user: User;
				};

				await redis.del(`session:user:${decoded.user.id}`);
				await UserServices.deleteUserRefreshToken(decoded.user.id);
			} catch {
				// swallow all token errors
			}
		}

		clearAuthCookies(res);
		return AppResponse.success(res, {}, 200, "Logout successful");
	}
};
