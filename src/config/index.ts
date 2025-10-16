import { env } from "./env";

export const config = {
	app: {
		env: env.NODE_ENV,
		port: Number(env.PORT),
		logLevel: env.LOG_LEVEL
	},
	db: {
		db_name: env.POSTGRES_DB,
		db_user: env.POSTGRES_USER,
		db_pass: env.POSTGRES_PASSWORD,
		uri: `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@postgres:5432/${env.POSTGRES_DB}`
	},
	auth: {
		jwtAccessTokenSecret: env.JWT_ACCESSTOKEN_SECRET,
		jwtRefreshTokenSecret: env.JWT_REFRESHTOKEN_SECRET,
		accessTokenDuration: env.ACCESSTOKEN_DURATION,
		refreshTokenDuration: env.REFRESHTOKEN_DURATION,
		google_client_id: env.AUTH_GOOGLE_CLIENT_ID,
		google_client_secret: env.AUTH_GOOGLE_CLIENT_SECRET
	},
	redis: {
		host: env.REDIS_HOST,
		port: env.REDIS_PORT
	},
	smtp: {
		SMTP_HOST: env.SMTP_HOST,
		SMTP_PORT: env.SMTP_PORT,
		SMTP_USER: env.SMTP_USER,
		SMTP_PASS: env.SMTP_PASS,
		SMTP_FROM: env.SMTP_FROM
	}
};
