import prisma from "../../../config/db";
import { generateToken } from "../../../utils/jwt";

export const AuthService = {
	// getAllAuths: async () => {
	// 	const posts = await prisma.auth.findMany({
	// 		include: {
	// 			author: true,
	// 		},
	// 	});
	// 	return posts;
	// },
	isValidRefreshToken: async (tokenId: number) => {
		const row = await prisma.refreshToken.findUnique({
			where: {
				id: tokenId,
			},
		});

		return row;
	},
};
