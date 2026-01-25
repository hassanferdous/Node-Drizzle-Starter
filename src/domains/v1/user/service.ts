import { db } from "@/config/db";
import {
	permissions,
	role_permissions,
	roles,
	user_roles,
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
import { AuthUser } from "@/types/index";

export type User = Omit<InferSelectModel<typeof usersTable>, "password">;
export type NewUser = InferInsertModel<typeof usersTable>;
export type Role = InferSelectModel<typeof roles>;

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
				img: usersTable.img,
				age: usersTable.age
			})
			.from(usersTable)
			.where(eq(usersTable.id, id));
		const user = result[0] ?? null;
		if (!user) return user;

		if (populatePermissions) {
			const permissions = await PermissionServices.getUserPermissions();
			return { ...user, permissions };
		}
		return { ...user };
	},

	getByEmail: async (
		email: string,
		populatePassword: boolean = false
	): Promise<Partial<AuthUser> | null> => {
		const result = await db
			.select({
				name: usersTable.name,
				email: usersTable.email,
				id: usersTable.id,
				provider: usersTable.provider,
				...(populatePassword ? { password: usersTable.password } : {}),
				roleId: roles.id,
				roleName: roles.name,
				roleParentId: roles.parentId,
				scopeType: user_roles.scopeType,
				scopeId: user_roles.scopeId,
				permissionId: role_permissions.permissionId,
				resource: permissions.resource,
				action: permissions.action,
				description: permissions.description
			})
			.from(usersTable)
			.leftJoin(user_roles, eq(usersTable.id, user_roles.userId))
			.leftJoin(roles, eq(user_roles.roleId, roles.id))
			.leftJoin(role_permissions, eq(roles.id, role_permissions.roleId))
			.leftJoin(
				permissions,
				eq(role_permissions.permissionId, permissions.id)
			)
			.where(eq(usersTable.email, email));
		const user = result[0] ?? null;
		const filteredData = result.filter((item) => !!item.roleId);
		const userPermissions = filteredData
			.filter((item) => !!item.permissionId)
			.map((item) => ({
				resource: item.resource!,
				action: item.action!,
				description: item.description
			}));
		const userRoles = filteredData.map((item) => ({
			id: item.roleId,
			name: item.roleName,
			parentId: item.roleParentId,
			scopeType: item.scopeType,
			scopeId: item.scopeId
		})) as unknown as Role[];
		if (!user) return user;
		return { ...user, roles: userRoles, permissions: userPermissions };
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
	createUserSessionDB: async (data: NewRefreshToken) => {
		const result = await db.insert(userTokensTable).values(data);
		return result;
	},
	deleteUserRefreshToken: async (userId: number) => {
		const result = await db
			.delete(userTokensTable)
			.where(eq(userTokensTable.userId, userId));
		return result;
	},

	// get User role permissions (role-permissions + additional-permissions - denied permissions)
	getUserPermissions: async (userId: number) => {
		const user = await UserServices.getById(userId, false);
		if (!user) throwError("User not found", 400);
		const permissions = PermissionServices.getUserPermissions();
		return permissions;
	},

	// get User role permissions
	getUserRolePermissions: async (userId: number) => {
		const user = await db
			.select({})
			.from(usersTable)
			.where(eq(usersTable.id, userId))
			.limit(1)
			.then((res) => res[0]);

		if (!user) throwError("User not found", 400);
		const rolePerms = await RoleServices.getPermissions();

		return rolePerms;
	},

	assignRole: async (userId: number, roleIds: number[]) => {
		await db
			.insert(user_roles)
			.values(
				roleIds.map((roleId) => ({
					userId,
					roleId,
					scopeType: "global",
					scopeId: null
				}))
			)
			.onConflictDoNothing({
				target: [user_roles.userId, user_roles.roleId]
			});
	}
};
