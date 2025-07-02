"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function main() {
    await prisma.user.createMany({
        data: [
            { email: "alice1@prisma.io", name: "Alice One" },
            { email: "alice2@prisma.io", name: "Alice Two" },
            { email: "alice3@prisma.io", name: "Alice Three" },
            { email: "alice4@prisma.io", name: "Alice Four" },
            { email: "alice5@prisma.io", name: "Alice Five" },
        ],
    });
    await prisma.post.createMany({
        data: [
            {
                title: "First Post",
                description: "This is the first post.",
                authorId: 1,
            },
            {
                title: "Second Post",
                description: "This is the second post.",
                authorId: 1,
            },
            {
                title: "Third Post",
                description: "This is the third post.",
                authorId: 1,
            },
            {
                title: "Fourth Post",
                description: "This is the fourth post.",
                authorId: 1,
            },
            {
                title: "Fifth Post",
                description: "This is the fifth post.",
                authorId: 1,
            },
        ],
    });
    await prisma.category.createMany({
        data: [{ name: "Technology" }, { name: "Health" }, { name: "Travel" }],
    });
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
