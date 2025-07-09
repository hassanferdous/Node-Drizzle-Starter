import { env } from "./env";

export const config = {
	app: {
		env: env.NODE_ENV,
		port: Number(env.PORT)
	},
	db: {
		uri: env.DATABASE_URL
	}
	// auth: {
	// 	jwtSecret: env.JWT_SECRET
	// }
};
