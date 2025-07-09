import { env } from "./env";

export const config = {
	app: {
		env: env.NODE_ENV,
		port: Number(env.PORT)
	},
	db: {
		uri: env.DATABASE_URL
	},
	auth: {
		jwtAccessTokenSecret: env.JWT_ACCESSTOKEN_SECRET,
		jwtRefreshTokenSecret: env.JWT_REFRESHTOKEN_SECRET,
		accessTokenDuration: env.ACCESSTOKEN_DURATION,
		refreshTokenDuration: env.REFRESHTOKEN_DURATION
	}
};
