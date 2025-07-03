import { db } from "@/config/db";
import { usersTable, userTokensTable } from "@/db/schema";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { NewRefreshToken } from "../auth/service";

export type User = InferSelectModel<typeof usersTable>;
export type NewUser = InferInsertModel<typeof usersTable>;

export const services = {
	create: async (data: NewUser): Promise<User> => {
		const [created] = await db.insert(usersTable).values(data).returning();
		return created;
	},

	getById: async (id: number): Promise<User | null> => {
		const result = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id));
		return result[0] ?? null;
	},

	getByEmail: async (email: string) => {
		const result = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));
		return result[0] ?? null;
	},

	getAll: async (): Promise<User[]> => {
		return db.select().from(usersTable);
	},

	update: async (id: number, data: NewUser): Promise<User | null> => {
		const [updated] = await db
			.update(usersTable)
			.set(data)
			.where(eq(usersTable.id, id))
			.returning();
		return updated ?? null;
	},

	delete: async (id: number): Promise<User | null> => {
		const [deleted] = await db
			.delete(usersTable)
			.where(eq(usersTable.id, id))
			.returning();
		return deleted ?? null;
	},

	getRefreshUserToken: async (userId: number) => {
		const results = await db
			.select()
			.from(userTokensTable)
			.where(eq(userTokensTable.userId, userId));
		const storedToken = results[0] ?? null;
		return storedToken;
	},
	createRefreshUserToken: async (data: NewRefreshToken) => {
		const result = await db.insert(userTokensTable).values(data);
		return result;
	},
};
