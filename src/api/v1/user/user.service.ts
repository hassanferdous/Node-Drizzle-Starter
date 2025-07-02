import prisma from "../../../config/db";

export const UserService = {
	getUsers: async () => {
		const users = await prisma.user.findMany({
			omit: {
				password: true,
			},
		});
		return users;
	},
	createUser: async (inputs: {
		name: string;
		email: string;
		password: string;
	}) => {
		const newUser = await prisma.user.create({
			data: inputs,
		});
		return newUser;
	},
};
