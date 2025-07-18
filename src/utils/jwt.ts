import { config } from "@/config";
import jwt from "jsonwebtoken";
type TokenType = "access" | "refresh" | "both";
export const generateToken = (payload: any, type: TokenType = "both") => {
	let tokens: { access_token?: string; refresh_token?: string } = {};
	switch (type) {
		case "both":
			tokens.access_token = jwt.sign(
				payload,
				config.auth.jwtAccessTokenSecret,
				{
					expiresIn: parseInt(config.auth.accessTokenDuration)
				}
			);
			tokens.refresh_token = jwt.sign(
				payload,
				config.auth.jwtRefreshTokenSecret,
				{
					expiresIn: config.auth.refreshTokenDuration as any
				}
			);
			break;
		case "access":
			tokens.access_token = jwt.sign(
				payload,
				config.auth.jwtAccessTokenSecret,
				{
					expiresIn: parseInt(config.auth.accessTokenDuration)
				}
			);
			break;
		case "refresh":
			tokens.refresh_token = jwt.sign(
				payload,
				config.auth.jwtRefreshTokenSecret,
				{
					expiresIn: config.auth.refreshTokenDuration as any
				}
			);
			break;
	}
	return tokens;
};

export const verifyToken = (
	token: string,
	type: "access" | "refresh" = "access"
) => {
	const secret =
		type === "access"
			? config.auth.jwtAccessTokenSecret
			: config.auth.jwtRefreshTokenSecret;
	const decoded = jwt.verify(token, secret);
	return decoded;
};
