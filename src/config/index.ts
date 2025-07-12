import { env } from "./env";

export const config = {
	app: {
		env: env.NODE_ENV,
		port: Number(env.PORT)
	},
	db: {
		db_name: env.POSTGRES_DB,
		db_user: env.POSTGRES_USER,
		db_pass: env.POSTGRES_PASSWORD,
		uri: `postgresql://postgres:${env.POSTGRES_PASSWORD}@postgres:5432/${env.POSTGRES_DB}`
	},
	auth: {
		jwtAccessTokenSecret: env.JWT_ACCESSTOKEN_SECRET,
		jwtRefreshTokenSecret: env.JWT_REFRESHTOKEN_SECRET,
		accessTokenDuration: env.ACCESSTOKEN_DURATION,
		refreshTokenDuration: env.REFRESHTOKEN_DURATION
	},
	redis: {
		host: env.REDIS_HOST,
		port: env.REDIS_PORT
	}
};
