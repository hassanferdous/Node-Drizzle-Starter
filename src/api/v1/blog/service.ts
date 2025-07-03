import { db } from "@/config/db";
import { blogsTable } from "@/db/schema";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

type Blog = InferSelectModel<typeof blogsTable>;
type NewBlog = InferInsertModel<typeof blogsTable>;

export const services = {
	create: async (data: NewBlog): Promise<Blog> => {
		const [created] = await db.insert(blogsTable).values(data).returning();
		return created;
	},

	getById: async (id: number): Promise<Blog | null> => {
		const result = await db
			.select()
			.from(blogsTable)
			.where(eq(blogsTable.id, id));
		return result[0] ?? null;
	},

	getAll: async (): Promise<Blog[]> => {
		return db.select().from(blogsTable);
	},

	update: async (id: number, data: NewBlog): Promise<Blog | null> => {
		const [updated] = await db
			.update(blogsTable)
			.set(data)
			.where(eq(blogsTable.id, id))
			.returning();
		return updated ?? null;
	},

	delete: async (id: number): Promise<Blog | null> => {
		const [deleted] = await db
			.delete(blogsTable)
			.where(eq(blogsTable.id, id))
			.returning();
		return deleted ?? null;
	},
};
