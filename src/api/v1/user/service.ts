import { db } from "@/config/db";
import {
	permissions,
	role_permissions,
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
	getPermissionsByRoleId: async (roleId: number) => {
		const result = await db.execute(
			sql`
			SELECT array_agg(${permissions.name}) AS permissions
			FROM ${role_permissions}
			LEFT JOIN ${permissions}
			ON ${role_permissions.permissionId} = ${permissions.id}
			WHERE ${role_permissions.roleId} = ${roleId}
		`
		);
		return result.rows[0]?.permissions ?? [];
	}
};
