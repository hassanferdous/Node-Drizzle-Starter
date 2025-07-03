import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }),
	age: integer(),
	email: varchar({ length: 255 }).notNull().unique(),
	password: varchar().notNull(),
	img: varchar({ length: 255 }),
});

export const userTokensTable = pgTable("user_tokens", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: integer()
		.notNull()
		.references(() => usersTable.id),
	refreshToken: varchar({ length: 512 }).notNull().unique(),
	createdAt: varchar({ length: 50 }).default(sql`CURRENT_TIMESTAMP`),
	userAgent: varchar({ length: 255 }),
	ipAddress: varchar({ length: 50 }),
});
