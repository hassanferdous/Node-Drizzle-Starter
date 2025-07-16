import { config } from "@/config";
import { UserServices } from "@domains/v1/user/service";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
	new GoogleStrategy(
		{
			clientID: config.auth.google_client_id,
			clientSecret: config.auth.google_client_secret,
			callbackURL: "http://localhost:8001/api/v1/auth/google/callback"
		},
		async (accessToken, refreshToken, profile, cb) => {
			try {
				const user = await UserServices.getByEmail(
					profile._json.email as string
				);
				if (user) return cb(null, user);
				const newUser = await UserServices.create({
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
