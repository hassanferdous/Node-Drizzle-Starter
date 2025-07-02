import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
	const salt = await bcrypt.genSalt(Number(process.env.HASH_SALT as string));
	const hashPassword = await bcrypt.hash("test1234", salt);
	await prisma.user.createMany({
		data: [
			{
				email: "alice1@prisma.io",
				name: "Alice One",
				password: hashPassword,
			},
		],
		skipDuplicates: true,
	});
	// await prisma.post.createMany({
	// 	data: [
	// 		{
	// 			title: "First Post",
	// 			description: "This is the first post.",
	// 			authorId: 1,
	// 		},
	// 		{
	// 			title: "Second Post",
	// 			description: "This is the second post.",
	// 			authorId: 1,
	// 		},
	// 		{
	// 			title: "Third Post",
	// 			description: "This is the third post.",
	// 			authorId: 1,
	// 		},
	// 		{
	// 			title: "Fourth Post",
	// 			description: "This is the fourth post.",
	// 			authorId: 1,
	// 		},
	// 		{
	// 			title: "Fifth Post",
	// 			description: "This is the fifth post.",
	// 			authorId: 1,
	// 		},
	// 	],
	// });

	// await prisma.category.createMany({
	// 	data: [{ name: "Technology" }, { name: "Health" }, { name: "Travel" }],
	// });
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
