import { db } from "@/config/db";
import { examplesTable } from "@/db/schema";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

type Example = InferSelectModel<typeof examplesTable>;
type NewExample = InferInsertModel<typeof examplesTable>;

export const services = {
	create: async (data: NewExample): Promise<Example> => {
		const [created] = await db.insert(examplesTable).values(data).returning();
		return created;
	},

	getById: async (id: number): Promise<Example | null> => {
		const result = await db
			.select()
			.from(examplesTable)
			.where(eq(examplesTable.id, id));
		return result[0] ?? null;
	},

	getAll: async (): Promise<Example[]> => {
		return db.select().from(examplesTable);
	},

	update: async (id: number, data: NewExample): Promise<Example | null> => {
		const [updated] = await db
			.update(examplesTable)
			.set(data)
			.where(eq(examplesTable.id, id))
			.returning();
		return updated ?? null;
	},

	delete: async (id: number): Promise<Example | null> => {
		const [deleted] = await db
			.delete(examplesTable)
			.where(eq(examplesTable.id, id))
			.returning();
		return deleted ?? null;
	},
};
