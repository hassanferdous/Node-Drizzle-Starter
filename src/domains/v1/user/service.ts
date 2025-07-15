import { db } from "@/config/db";
import {
	deniedPermissions,
	permissions,
	role_permissions,
	userPermissions,
	usersTable,
	userTokensTable
} from "@/db/schema";
import { throwError } from "@/utils/error";
import bcrypt from "bcryptjs";
import {
	and,
	eq,
	inArray,
	InferInsertModel,
	InferSelectModel
} from "drizzle-orm";
import { NewRefreshToken } from "../auth/service";
import { services as permissionServices } from "@domains/v1/permission/service";

export type User = Omit<InferSelectModel<typeof usersTable>, "password">;
export type NewUser = InferInsertModel<typeof usersTable>;
export type UserPermission = InferSelectModel<typeof userPermissions>;

const insertUserPermissions = async (
	table: typeof userPermissions | typeof deniedPermissions,
	userId: number,
	permissions: number | number[]
) => {
	const isMulti = Array.isArray(permissions);
	const values = isMulti
		? permissions.map((pId) => ({ userId, permissionId: pId }))
		: [{ userId, permissionId: permissions }];

	return await db
		.insert(table)
		.values(values)
		.onConflictDoNothing()
		.returning();
};

const deleteUserPermissions = async (
	table: typeof userPermissions | typeof deniedPermissions,
	userId: number,
	permissions: number | number[]
) => {
	const isMulti = Array.isArray(permissions);

	return await db
		.delete(table)
		.where(
			and(
				eq(table.userId, userId),
				isMulti
					? inArray(table.permissionId, permissions)
					: eq(table.permissionId, permissions)
			)
		)
		.returning();
};

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
				roleId: usersTable.roleId,
				createdAt: usersTable.createdAt,
				updatedAt: usersTable.updatedAt
			});
		return created;
	},

	getById: async (
		id: number
	): Promise<Partial<User & { permissions?: string[] }> | null> => {
		const result = await db
			.select({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				roleId: usersTable.roleId,
				img: usersTable.img,
				age: usersTable.age
			})
			.from(usersTable)
			.where(eq(usersTable.id, id));
		const user = result[0] ?? null;
		if (!user) return user;

		const permissions = await permissionServices.getUserPermissions(user);
		return { ...user, permissions };
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

	update: async (id: number, data: NewUser): Promise<Partial<User> | null> => {
		const [updated] = await db
			.update(usersTable)
			.set(data)
			.where(eq(usersTable.id, id))
			.returning({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				roleId: usersTable.roleId,
				img: usersTable.img,
				age: usersTable.age
			});
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
	createUserRefreshToken: async (data: NewRefreshToken) => {
		const result = await db.insert(userTokensTable).values(data);
		return result;
	},

	// get User role permissions (role-permissions + additional-permissions - denied permissions)
	getUserPermissions: async (userId: number) => {
		const user = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, userId))
			.limit(1)
			.then((res) => res[0]);

		if (!user) throwError("User not found");
		const permissions = permissionServices.getUserPermissions(user);
		return permissions;
	},

	// get User role permissions
	getUserRolePermissions: async (userId: number): Promise<number[]> => {
		const user = await db
			.select({ roleId: usersTable.roleId })
			.from(usersTable)
			.where(eq(usersTable.id, userId))
			.limit(1)
			.then((res) => res[0]);

		if (!user) throwError("User not found");

		const rolePerms = await db
			.select({ permissionId: role_permissions.permissionId })
			.from(role_permissions)
			.where(eq(role_permissions.roleId, user.roleId as number));

		return rolePerms.map((p) => p.permissionId as number);
	},

	// User's additioinal permissions
	grantAdditionalPermission: async (
		userId: number,
		permission: number | number[]
	) => {
		const rolePermIds = await services.getUserRolePermissions(userId);
		const permissionArray = Array.isArray(permission)
			? permission
			: [permission];
		const validToAdd = permissionArray.filter(
			(pid) => !rolePermIds.includes(pid)
		);
		if (!validToAdd.length) {
			throwError(
				"No valid permissions to add — already granted via role.",
				403
			);
		}
		return insertUserPermissions(userPermissions, userId, validToAdd);
	},

	getAdditionalPermission: async (userId: number) => {
		const result = await db
			.select({ permissionId: permissions.id, permission: permissions.name })
			.from(userPermissions)
			.leftJoin(
				permissions,
				eq(userPermissions.permissionId, permissions.id)
			)
			.where(eq(userPermissions.userId, userId));
		return result;
	},

	deleteAdditionalPermission: (
		userId: number,
		permissions: number | number[]
	) => {
		return deleteUserPermissions(userPermissions, userId, permissions);
	},

	// User's denied deleteUserPermissions(userPermissions, userId, permissions)
	deniedPermission: async (userId: number, permission: number | number[]) => {
		const rolePermIds = await services.getUserRolePermissions(userId);
		const permissionArray = Array.isArray(permission)
			? permission
			: [permission];
		const validToDeny = permissionArray.filter((pid) =>
			rolePermIds.includes(pid)
		);
		if (validToDeny.length) {
			return insertUserPermissions(deniedPermissions, userId, permission);
		}
		throwError(
			"No valid permissions to deny. only role permissions can be denied",
			403
		);
	},
	getDeniedPermission: async (userId: number) => {
		const result = db
			.select({ permissionId: permissions.id, permission: permissions.name })
			.from(deniedPermissions)
			.leftJoin(
				permissions,
				eq(deniedPermissions.permissionId, permissions.id)
			)
			.where(eq(deniedPermissions.userId, userId));
		return result;
	},
	deleteDeniedPermission: (userId: number, permissions: number | number[]) => {
		return deleteUserPermissions(deniedPermissions, userId, permissions);
	}
};
