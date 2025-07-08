"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTokensTable = exports.usersTable = exports.userPermissions = exports.role_permissions = exports.permissions = exports.roles = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.roles = (0, pg_core_1.pgTable)("roles", {
    id: (0, pg_core_1.serial)().primaryKey(),
    name: (0, pg_core_1.text)().notNull().unique()
});
exports.permissions = (0, pg_core_1.pgTable)("permissions", {
    id: (0, pg_core_1.serial)().primaryKey(),
    name: (0, pg_core_1.text)().notNull().unique()
});
exports.role_permissions = (0, pg_core_1.pgTable)("role_permissions", {
    roleId: (0, pg_core_1.integer)("role_id").references(() => exports.roles.id),
    permissionId: (0, pg_core_1.integer)("permission_id").references(() => exports.permissions.id)
}, (table) => ({
    pk: (0, pg_core_1.primaryKey)({ columns: [table.roleId, table.permissionId] })
}));
exports.userPermissions = (0, pg_core_1.pgTable)("user_permissions", {
    userId: (0, pg_core_1.integer)("user_id")
        .notNull()
        .references(() => exports.usersTable.id),
    permissionId: (0, pg_core_1.integer)("permission_id")
        .notNull()
        .references(() => exports.permissions.id)
}, (table) => ({
    pk: (0, pg_core_1.primaryKey)({
        columns: [table.userId, table.permissionId]
    })
}));
exports.usersTable = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)({ length: 255 }),
    age: (0, pg_core_1.integer)(),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)().notNull(),
    img: (0, pg_core_1.varchar)({ length: 255 }),
    roleId: (0, pg_core_1.integer)("role_id").references(() => exports.roles.id)
});
exports.userTokensTable = (0, pg_core_1.pgTable)("user_tokens", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    userId: (0, pg_core_1.integer)()
        .notNull()
        .references(() => exports.usersTable.id),
    refreshToken: (0, pg_core_1.varchar)({ length: 512 }).notNull().unique(),
    createdAt: (0, pg_core_1.varchar)({ length: 50 }).default((0, drizzle_orm_1.sql) `CURRENT_TIMESTAMP`),
    userAgent: (0, pg_core_1.varchar)({ length: 255 }),
    ipAddress: (0, pg_core_1.varchar)({ length: 50 })
});
