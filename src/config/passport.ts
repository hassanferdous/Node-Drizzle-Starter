import bcrypt from "bcryptjs";
import passport, { use } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "./db";

passport.use(
	new LocalStrategy(async function (email, password, cb) {
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		if (!user) {
			return cb(null, false, { message: "Incorrect email or password." });
		}
		const isMatched = await bcrypt.compare(password, user.password);
		if (!isMatched) {
			return cb(null, false, { message: "Incorrect email or password." });
		}
		return cb(null, { ...user, password: null });
	})
);
