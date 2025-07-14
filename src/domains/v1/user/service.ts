import { db } from "@/config/db";
import {
	permissions,
	role_permissions,
	userPermissions,
	usersTable,
	userTokensTable
} from "@/db/schema";
import { eq, InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { NewRefreshToken } from "../auth/service";
import bcrypt from "bcryptjs";

export type User = Omit<InferSelectModel<typeof usersTable>, "password">;
export type NewUser = InferInsertModel<typeof usersTable>;

export const services = {
	create: async (data: NewUser): Promise<User> => {
		const hashedPassword = await bcrypt.hash(
			"test1234",
			Number(process.env.HASH_SALT)
		);
		const [created] = await db
			.insert(usersTable)
			.values({ ...data, password: hashedPassword })
			.returning({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				age: usersTable.age,
				img: usersTable.img,
				roleId: usersTable.roleId
			});
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

	getAll: async (): Promise<Pick<User, "id" | "name" | "email">[]> => {
		return db
			.select({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email
			})
			.from(usersTable);
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
	getPermissionsPermissions: async (user: User) => {
		const rolePerms = await db
			.select({
				permission: permissions.name
			})
			.from(role_permissions)
			.leftJoin(
				permissions,
				eq(role_permissions.permissionId, permissions.id)
			)
			.where(eq(role_permissions.roleId, user.roleId as number));

		const userPerms = await db
			.select({
				permission: permissions.name
			})
			.from(userPermissions)
			.leftJoin(
				permissions,
				eq(permissions.id, userPermissions.permissionId)
			)
			.where(eq(userPermissions.userId, user.id as number));
		const _rolePermissions = rolePerms.map((rp) => rp.permission);
		const _userPermissions = userPerms.map((p) => p.permission);
		const uniquePermissionsSet = [
			...new Set([..._rolePermissions, ..._userPermissions])
		];

		return uniquePermissionsSet;
	}
};
