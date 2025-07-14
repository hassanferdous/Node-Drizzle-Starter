import {
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	varchar
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const roles = pgTable("roles", {
	id: serial().primaryKey(),
	name: text().notNull().unique()
});

export const permissions = pgTable("permissions", {
	id: serial().primaryKey(),
	name: text().notNull().unique()
});

export const role_permissions = pgTable(
	"role_permissions",
	{
		roleId: integer("role_id").references(() => roles.id),
		permissionId: integer("permission_id").references(() => permissions.id)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.roleId, table.permissionId] })
	})
);

export const userPermissions = pgTable(
	"user_permissions",
	{
		userId: integer("user_id")
			.notNull()
			.references(() => usersTable.id),
		permissionId: integer("permission_id")
			.notNull()
			.references(() => permissions.id)
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.userId, table.permissionId]
		})
	})
);

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }),
	email: varchar({ length: 255 }).notNull().unique(),
	password: varchar().notNull(),
	img: varchar({ length: 255 }),
	age: integer(),
	roleId: integer("role_id").references(() => roles.id)
});

export const userTokensTable = pgTable("user_tokens", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: integer()
		.notNull()
		.references(() => usersTable.id),
	refreshToken: varchar({ length: 512 }).notNull().unique(),
	createdAt: varchar({ length: 50 }).default(sql`CURRENT_TIMESTAMP`),
	userAgent: varchar({ length: 255 }),
	ipAddress: varchar({ length: 50 })
});
