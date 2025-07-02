import prisma from "../../../config/db";

export const BlogService = {
	getAllBlogs: async () => {
		const posts = await prisma.blog.findMany({
			include: {
				author: true,
			},
		});
		return posts;
	},
};
