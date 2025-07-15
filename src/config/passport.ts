import { User, services as userServices } from "@domains/v1/user/service";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "@/config";

// Local Strategy
passport.use(
	new LocalStrategy(
		{ usernameField: "email", passwordField: "password" },
		async function (email, password, cb) {
			const user = (await userServices.getByEmail(email)) as User & {
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

// Google strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: config.auth.google_client_id,
			clientSecret: config.auth.google_client_secret,
			callbackURL: "http://localhost:8001/api/v1/auth/google/callback"
		},
		async (accessToken, refreshToken, profile, cb) => {
			try {
				const user = await userServices.getByEmail(
					profile._json.email as string
				);
				if (user) return cb(null, user);
				const newUser = await userServices.create({
					name: profile._json.name,
					img: profile._json.picture,
					email: profile._json.email as string,
					provider: profile.provider,
					password: "" // You should use a random hash here if password is required
				});
				return cb(null, {
					name: newUser.name,
					email: newUser.email,
					id: newUser.id,
					roleId: newUser.roleId,
					provider: newUser.provider
				});
			} catch (err) {
				return cb(err as Error, false);
			}
		}
	)
);
