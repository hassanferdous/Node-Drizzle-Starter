import { db } from "@/config/db";
import { permissions, role_permissions } from "@/db/schema";
import { eq, inArray, InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Permission = InferSelectModel<typeof permissions>;
export type NewPermission = InferInsertModel<typeof permissions>;

export const PermissionServices = {
	create: async (
		data: NewPermission | NewPermission[]
	): Promise<Permission | Permission[]> => {
		if (Array.isArray(data)) {
			return await db
				.insert(permissions)
				.values(data)
				.onConflictDoNothing()
				.returning();
		}
		return (
			await db
				.insert(permissions)
				.values(data)
				.onConflictDoNothing()
				.returning()
		)[0];
	},

	getById: async (id: number): Promise<Permission | null> => {
		const result = await db
			.select()
			.from(permissions)
			.where(eq(permissions.id, id));
		return result[0] ?? null;
	},

	getAll: async (): Promise<Permission[]> => {
		return db.select().from(permissions);
	},

	update: async (
		id: number,
		data: NewPermission
	): Promise<Permission | null> => {
		const [updated] = await db
			.update(permissions)
			.set(data)
			.where(eq(permissions.id, id))
			.returning();
		return updated ?? null;
	},

	delete: async (id: number): Promise<{ id: number } | null> => {
		const [deleted] = await db
			.delete(permissions)
			.where(eq(permissions.id, id))
			.returning({ id: permissions.id });
		return deleted ?? null;
	},
	multiDelete: async (ids: number[]): Promise<{ id: number }[]> => {
		if (!ids.length) return [];

		return await db
			.delete(permissions)
			.where(inArray(permissions.id, ids))
			.returning({ id: permissions.id });
	},

	// get logged in user's permission
	getUserPermissions: async () => {
		return [];
	}
};
