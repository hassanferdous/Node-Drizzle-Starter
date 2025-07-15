import { db } from "@/config/db";
import { permissions, role_permissions, roles } from "@/db/schema";
import {
	and,
	eq,
	inArray,
	InferInsertModel,
	InferSelectModel
} from "drizzle-orm";

type Role = InferSelectModel<typeof roles>;
type NewRole = InferInsertModel<typeof roles>;
type Role_Permission = InferInsertModel<typeof role_permissions>;
type New_Role_Permission = InferInsertModel<typeof role_permissions>;

export const services = {
	create: async (data: NewRole): Promise<Role> => {
		const [created] = await db.insert(roles).values(data).returning();
		return created;
	},

	getById: async (id: number): Promise<Role | null> => {
		const result = await db.select().from(roles).where(eq(roles.id, id));
		return result[0] ?? null;
	},

	getAll: async (): Promise<Role[]> => {
		return db.select().from(roles);
	},

	update: async (id: number, data: NewRole): Promise<Role | null> => {
		const [updated] = await db
			.update(roles)
			.set(data)
			.where(eq(roles.id, id))
			.returning();
		return updated ?? null;
	},

	delete: async (id: number): Promise<Role | null> => {
		const [deleted] = await db
			.delete(roles)
			.where(eq(roles.id, id))
			.returning();
		return deleted ?? null;
	},

	// Role
	addPermissions: async (
		id: number,
		permissions: number[]
	): Promise<Role_Permission[]> => {
		const values: New_Role_Permission[] = permissions.map((pId) => ({
			roleId: id,
			permissionId: pId
		}));

		const result = await db
			.insert(role_permissions)
			.values(values)
			.onConflictDoNothing() // skip duplicates
			.returning();

		return result;
	},
	getPermissions: async (id: number): Promise<any[]> => {
		return await db
			.select({
				roleId: role_permissions.roleId,
				name: permissions.name,
				permissionId: permissions.id
			})
			.from(role_permissions)
			.where(eq(role_permissions.roleId, id))
			.leftJoin(
				permissions,
				eq(role_permissions.permissionId, permissions.id)
			);
	},
	removePermissions: async (id: number, permissions: number[]) => {
		return await db
			.delete(role_permissions)
			.where(
				and(
					eq(role_permissions.roleId, id),
					inArray(role_permissions.permissionId, permissions)
				)
			)
			.returning();
	},
	removeAllPermissions: async (id: number) => {
		await db.delete(role_permissions).where(eq(role_permissions.roleId, id));
	}
};
