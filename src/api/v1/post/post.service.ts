import prisma from "../../../config/db";

export const PostService = {
	getPosts: async () => {
		const posts = await prisma.post.findMany({
			include: {
				author: true,
			},
		});
		return posts;
	},
};
