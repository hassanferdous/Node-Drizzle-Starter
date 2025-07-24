import { db } from "@/config/db";
import {
	deniedPermissions,
	permissions,
	userPermissions,
	usersTable,
	userTokensTable
} from "@/db/schema";
import { throwError } from "@/utils/error";
import { PermissionServices } from "@domains/v1/permission/service";
import bcrypt from "bcryptjs";
import {
	and,
	eq,
	inArray,
	InferInsertModel,
	InferSelectModel
} from "drizzle-orm";
import { NewRefreshToken } from "../auth/service";
import { RoleServices } from "../role/service";

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

export const UserServices = {
	create: async (data: NewUser): Promise<Partial<User>> => {
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
		id: number,
		populatePermissions: boolean = true
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

		if (populatePermissions) {
			const permissions = await PermissionServices.getUserPermissions(
				user,
				true
			);
			return { ...user, permissions };
		}
		return { ...user };
	},

	getByEmail: async (email: string, populatePassword: boolean = false) => {
		const result = await db
			.select({
				name: usersTable.name,
				email: usersTable.email,
				id: usersTable.id,
				roleId: usersTable.roleId,
				provider: usersTable.provider,
				...(populatePassword ? { password: usersTable.password } : {})
			})
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

	update: async (
		id: number,
		data: Partial<NewUser>
	): Promise<Partial<User> | null> => {
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

	getUserRefreshToken: async (userId: number) => {
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
		const user = await UserServices.getById(userId, false);
		if (!user) throwError("User not found", 400);
		const permissions = PermissionServices.getUserPermissions({
			id: user?.id as number,
			roleId: user?.roleId as number
		});
		return permissions;
	},

	// get User role permissions
	getUserRolePermissions: async (userId: number) => {
		const user = await db
			.select({ roleId: usersTable.roleId })
			.from(usersTable)
			.where(eq(usersTable.id, userId))
			.limit(1)
			.then((res) => res[0]);

		if (!user) throwError("User not found", 400);
		if (!user.roleId) return [];
		const rolePerms = await RoleServices.getPermissions(user.roleId);

		return rolePerms;
	},

	// User's additioinal permissions
	grantAdditionalPermission: async (
		userId: number,
		permission: number | number[]
	) => {
		const rolePermIds = await UserServices.getUserRolePermissions(userId);
		const permissionArray = Array.isArray(permission)
			? permission
			: [permission];
		const validToAdd = permissionArray.filter(
			(p) => !rolePermIds.find((rP) => rP.permissionId === p)
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
		const rolePermIds = await UserServices.getUserRolePermissions(userId);
		const permissionArray = Array.isArray(permission)
			? permission
			: [permission];
		const validToDeny = permissionArray.filter(
			(p) => !rolePermIds.find((rP) => rP.permissionId === p)
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
