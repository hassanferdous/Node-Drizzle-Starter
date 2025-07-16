import { User, UserServices } from "@domains/v1/user/service";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Local Strategy
passport.use(
	new LocalStrategy(
		{ usernameField: "email", passwordField: "password" },
		async function (email, password, cb) {
			const user = (await UserServices.getByEmail(email, true)) as User & {
				password: string;
			};
			if (!user) {
				return cb(null, false, { message: "Incorrect email or password." });
			}
			const isMatched = await bcrypt.compare(password, user.password);
			if (!isMatched) {
				return cb(null, false, { message: "Incorrect email or password." });
			}
			const { password: userPassword, img, age, ...santizedUser } = user;
			return cb(null, santizedUser);
		}
	)
);
