import prisma from "../../../config/db";

export const UserService = {
	getUsers: async () => {
		const users = await prisma.user.findMany({});
		return users;
	},
	createUser: async ({ name, email }: { name: string; email: string }) => {
		const newUser = await prisma.user.create({
			data: {
				name,
				email,
			},
		});
		return newUser;
	},
};
