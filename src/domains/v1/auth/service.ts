import { config } from "@/config";
import { db } from "@/config/db";
import { usersTable, userTokensTable } from "@/db/schema";
import { generateOTP, saveOTP } from "@/lib/otp";
import redis from "@/lib/redis";
import { sendOtpEmailJob } from "@/queues/email.producer";
import { setAuthCookies, TokenOptions } from "@/utils/cookie";
import { throwError } from "@/utils/error";
import { generateToken, verifyToken } from "@/utils/jwt";
import { hashedPassword } from "@/utils/password-hash";
import { sendSuccess } from "@/utils/response";
import { PermissionServices } from "@domains/v1/permission/service";
import { UserServices } from "@domains/v1/user/service";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { v4 as uuidv4 } from "uuid";
import { User } from "../user/service";

export type UserRefreshToken = InferSelectModel<typeof userTokensTable>;
export type NewRefreshToken = InferInsertModel<typeof userTokensTable>;

export async function createSession(user: User) {
	const permissions = await PermissionServices.getUserPermissions(user);
	const sid = `session:user:${user.id}`;
	const csrf = uuidv4();

	await redis.set(
		sid,
		JSON.stringify({ csrf, permissions, userId: user.id }),
		"EX",
		parseInt(config.auth.accessTokenDuration)
	);
	return { csrf, permissions, sid };
}

// Generate access token
async function generateAccessToken(user: User) {
	const { csrf, sid } = await createSession(user);
	const tokens = generateToken({
		user: { id: user.id, email: user.email },
		sid: sid
	});
	const data = {
		user: { id: user.id, email: user.email },
		...tokens,
		csrf
	};

	await UserServices.createUserRefreshToken({
		userId: user.id,
		refreshToken: tokens.refresh_token as string
	});

	return { data, tokens: tokens as TokenOptions };
}

// Generate one time code and return redirect url
async function generateOneTimeCode(user: User) {
	const { data, tokens } = await generateAccessToken(user);
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

	callback_google: async (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate(
			"google",
			{ session: false },
			async (err, user: User, info) => {
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
	},

	exchangeToken: async (req: Request, res: Response) => {
		const code = req.query.code;
		const cached = await redis.get(`auth:code:${code}`);
		if (!cached) return throwError("Invalid or expired code", 400);
		await redis.del(`auth:code:${code}`);
		return sendSuccess(res, JSON.parse(cached), 200);
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
				img: usersTable.img,
				roleId: usersTable.roleId
			});

		return sendSuccess(res, result);
	},

	forgotPassword: async (req: Request, res: Response) => {
		const otp = generateOTP();
		await saveOTP(req.body.email, otp);
		await sendOtpEmailJob({
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
					<p><strong>This code will expire in 2 minutes.</strong></p>
					<p>If you did not request this, please ignore this email.</p>
					<hr style="margin-top: 30px;" />
					<p style="font-size: 12px; color: #888;">Thank you,<br />The YourApp Team</p>
				</div>
			`
		});
		sendSuccess(
			res,
			{},
			200,
			"Sent OTP successfully. Please check your email"
		);
	},

	verifyOTP: async () => {}
};
