import jwt from "jsonwebtoken";
type TokenType = "access" | "refresh" | "both";
export const generateToken = (payload: any, type: TokenType = "both") => {
	let tokens: { access_token?: string; refresh_token?: string } = {};
	switch (type) {
		case "both":
			tokens.access_token = jwt.sign(
				payload,
				process.env.JWT_ACCESSTOKEN_SECRET as string,
				{
					expiresIn: process.env.ACCESSTOKEN_DURATION as any,
				}
			);
			tokens.refresh_token = jwt.sign(
				payload,
				process.env.JWT_REFRESHTOKEN_SECRET as string,
				{
					expiresIn: process.env.REFRESHTOKEN_DURATION as any,
				}
			);
			break;
		case "access":
			tokens.access_token = jwt.sign(
				payload,
				process.env.JWT_ACCESSTOKEN_SECRET as string,
				{
					expiresIn: process.env.ACCESSTOKEN_DURATION as any,
				}
			);
			break;
		case "refresh":
			tokens.refresh_token = jwt.sign(
				payload,
				process.env.JWT_REFRESHTOKEN_SECRET as string,
				{
					expiresIn: process.env.REFRESHTOKEN_DURATION as any,
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
			? process.env.JWT_ACCESSTOKEN_SECRET
			: process.env.JWT_ACCESSTOKEN_SECRET;
	const decoded = jwt.verify(token, secret as string);
	return decoded;
};
