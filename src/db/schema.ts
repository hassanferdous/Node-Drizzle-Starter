import {
	foreignKey,
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	varchar
} from "drizzle-orm/pg-core";
import { timestampColumns } from "./common";

// --------------------
// Roles (Hierarchical)
// --------------------
export const roles = pgTable(
	"roles",
	{
		id: serial().primaryKey(),
		name: text().notNull().unique(),
		description: text(),
		parentId: integer("parent_id"),
		...timestampColumns
	},
	(table) => [
		foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "roles_parent_id"
		})
	]
);

// --------------------
// Permissions (Action on Resource)
// --------------------
export const permissions = pgTable("permissions", {
	id: serial().primaryKey(),
	resource: text().notNull(), // e.g., "course", "lesson", "quiz"
	action: text().notNull(), // e.g., "create", "update", "submit"
	description: text(),
	...timestampColumns
});

// --------------------
// Role → Permission Mapping
// --------------------
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

// --------------------
// Users
// --------------------
export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }),
	email: varchar({ length: 255 }).notNull().unique(),
	password: varchar().notNull(),
	img: varchar({ length: 255 }),
	age: integer(),
	provider: varchar().notNull().default("credential"),
	...timestampColumns
});

// --------------------
// User → Role Mapping (MULTI-ROLE & SCOPED)
// --------------------
export const user_roles = pgTable(
	"user_roles",
	{
		userId: integer("user_id")
			.references(() => usersTable.id, { onDelete: "cascade" })
			.notNull(),
		roleId: integer("role_id")
			.references(() => roles.id, { onDelete: "cascade" })
			.notNull(),
		scopeType: varchar("scope_type", { length: 20 }).notNull(), // "global" | "course"
		scopeId: integer("scope_id"), // course_id if scoped
		...timestampColumns
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.userId, table.roleId]
		})
	})
);

// --------------------
// User Tokens
// --------------------
export const userTokensTable = pgTable("user_tokens", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: integer()
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	refreshToken: varchar({ length: 512 }).notNull().unique(),
	userAgent: varchar({ length: 255 }),
	ipAddress: varchar({ length: 50 }),
	expires_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
	...timestampColumns
});
