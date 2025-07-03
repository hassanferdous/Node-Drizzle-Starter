import bcrypt from "bcryptjs";
import passport, { use } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "./db";
import { generateToken } from "../utils/jwt";

passport.use(
	new LocalStrategy(async function (email, password, cb) {
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
			omit: {
				createdAt: true,
				updatedAt: true,
				img: true,
			},
		});
		if (!user) {
			return cb(null, false, { message: "Incorrect email or password." });
		}
		const isMatched = await bcrypt.compare(password, user.password);
		if (!isMatched) {
			return cb(null, false, { message: "Incorrect email or password." });
		}
		const { password: userPassword, ...santizedUser } = user;
		// generate tokens
		const tokens = generateToken({ user: santizedUser });
		const currentSession = await prisma.refreshToken.create({
			data: {
				refresh_token: tokens.refresh_token as string,
				userId: santizedUser.id,
			},
		});
		return cb(null, {
			...santizedUser,
			...tokens,
			refresh_token:
				currentSession.id.toString() + "|" + tokens.refresh_token,
			password: null,
		});
	})
);
