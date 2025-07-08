import { services as userServices } from "@api/v1/user/service";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
	new LocalStrategy(async function (email, password, cb) {
		const user = await userServices.getByEmail(email);
		if (!user) {
			return cb(null, false, { message: "Incorrect email or password." });
		}
		const isMatched = await bcrypt.compare(password, user.password);
		if (!isMatched) {
			return cb(null, false, { message: "Incorrect email or password." });
		}
		const { password: userPassword, img, age, ...santizedUser } = user;
		return cb(null, santizedUser);
	})
);
