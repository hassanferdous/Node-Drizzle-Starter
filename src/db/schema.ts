import {
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	varchar
} from "drizzle-orm/pg-core";
import { timestampColumns } from "./common";

export const roles = pgTable("roles", {
	id: serial().primaryKey(),
	name: text().notNull().unique()
});

export const permissions = pgTable("permissions", {
	id: serial().primaryKey(),
	name: text().notNull().unique(),
	description: text(),
	...timestampColumns
});

export const role_permissions = pgTable(
	"role_permissions",
	{
		roleId: integer("role_id").references(() => roles.id, {
			onDelete: "cascade"
		}),
		permissionId: integer("permission_id").references(() => permissions.id, {
			onDelete: "cascade"
		})
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
			.references(() => usersTable.id, { onDelete: "cascade" }),
		permissionId: integer("permission_id")
			.notNull()
			.references(() => permissions.id, { onDelete: "cascade" })
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.userId, table.permissionId]
		})
	})
);

export const deniedPermissions = pgTable(
	"denied_permissions",
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
	roleId: integer("role_id").references(() => roles.id, {
		onDelete: "set null"
	}),
	provider: varchar().notNull().default("credential"),
	...timestampColumns
});

export const userTokensTable = pgTable("user_tokens", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: integer()
		.notNull()
		.references(() => usersTable.id),
	refreshToken: varchar({ length: 512 }).notNull().unique(),
	userAgent: varchar({ length: 255 }),
	ipAddress: varchar({ length: 50 }),
	...timestampColumns
});
