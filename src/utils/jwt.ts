import { config } from "@/config";
import jwt from "jsonwebtoken";
type TokenType = "access" | "refresh" | "both";

export const generateToken = (
	payload: any,
	options: {
		expiresIn: number | string;
		secret: string;
	}
) => {
	const signedToken = jwt.sign(payload, options.secret, {
		expiresIn: options.expiresIn as any
	});

	return signedToken;
};

export const verifyToken = (
	token: string,
	secret: string
): jwt.JwtPayload | string => {
	return jwt.verify(token, secret);
};

export const generateAuthTokens = (payload: any, type: TokenType = "both") => {
	let tokens: { access_token?: string; refresh_token?: string } = {};
	switch (type) {
		case "both":
			tokens.access_token = generateToken(payload, {
				expiresIn: parseInt(config.auth.accessTokenDuration),
				secret: config.auth.jwtAccessTokenSecret
			});
			tokens.refresh_token = generateToken(payload, {
				expiresIn: config.auth.refreshTokenDuration,
				secret: config.auth.jwtRefreshTokenSecret
			});
			break;
		case "access":
			tokens.access_token = generateToken(payload, {
				expiresIn: parseInt(config.auth.accessTokenDuration),
				secret: config.auth.jwtAccessTokenSecret
			});
			break;
		case "refresh":
			tokens.refresh_token = generateToken(payload, {
				expiresIn: config.auth.refreshTokenDuration,
				secret: config.auth.jwtRefreshTokenSecret
			});
			break;
	}
	return tokens;
};

export const verifyAuthTokens = (
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
