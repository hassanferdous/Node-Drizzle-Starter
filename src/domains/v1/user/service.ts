import { AppAbility } from "@/abilities/app.ability";
import { db } from "@/config/db";
import { roles, user_roles, usersTable, userTokensTable } from "@/db/schema";
import { AuthUser } from "@/types/index";
import { throwError } from "@/utils/error";
import { RawRuleOf } from "@casl/ability";
import { PermissionServices } from "@domains/v1/permission/service";
import bcrypt from "bcryptjs";
import { eq, InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { NewRefreshToken } from "../auth/service";

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
	): Promise<Partial<AuthUser> | null> => {
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
		const user = await db
			.select({
				id: usersTable.id,
				name: usersTable.name,
				email: usersTable.email,
				img: usersTable.img,
				age: usersTable.age,
				provider: usersTable.provider,
				...(populatePassword ? { password: usersTable.password } : {})
			})
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.limit(1)
			.then((res) => res[0]);
		if (!user) return null;
		const userRolePermissions = await UserServices.getUserRolePermissions(
			user.id
		);
		return {
			...user,
			permissions: userRolePermissions.permissions,
			roles: userRolePermissions.roles
		};
	},

	getUserRolePermissions: async (
		id: number
	): Promise<{ roles: Role[]; permissions: RawRuleOf<AppAbility>[] }> => {
		const query = await db.execute(sql`
					WITH RECURSIVE role_tree AS (
						SELECT
							r.id,
							r.parent_id,
							r.name
						FROM roles r
						INNER JOIN user_roles ur ON r.id = ur.role_id
						WHERE ur.user_id = ${id}

						UNION ALL

						SELECT
							parent.id,
							parent.parent_id,
							parent.name
						FROM roles parent
						INNER JOIN role_tree rt ON rt.id = parent.parent_id
					)
					SELECT
						role_tree.id AS role_id,
						role_tree.name AS role_name,
						p.subject,
						p.action,
						p.conditions,
						p.description,
						p.id AS permission_id,
						p.inverted
					FROM role_tree
					LEFT JOIN role_permissions rp ON role_tree.id = rp.role_id
					LEFT JOIN permissions p ON p.id = rp.permission_id

					UNION ALL

					SELECT
						NULL AS role_id,
						NULL AS role_name,
						p.subject,
						p.action,
						p.conditions,
						p.description,
						p.id AS permission_id,
						p.inverted
					FROM access_restrictions ar
					INNER JOIN permissions p ON p.id = ar.permission_id
					WHERE ar.user_id = ${id};
					`);
		const roles = [
			...new Set(
				query.rows
					.filter((item) => item.role_name)
					.map((item) => item.role_name)
			)
		] as Role[];
		const permissions = query.rows
			.filter((item) => item.permission_id)
			.map((item) => ({
				id: item.permission_id,
				subject: item.subject,
				action: item.action,
				conditions: item.conditions,
				description: item.description,
				inverted: item.inverted
			})) as RawRuleOf<AppAbility>[];
		return { roles, permissions };
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
