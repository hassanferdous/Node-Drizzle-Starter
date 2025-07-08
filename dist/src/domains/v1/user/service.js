"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const db_1 = require("@/config/db");
const schema_1 = require("@/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.services = {
    create: async (data) => {
        const hashedPassword = await bcryptjs_1.default.hash("test1234", Number(process.env.HASH_SALT));
        const [created] = await db_1.db
            .insert(schema_1.usersTable)
            .values({ ...data, password: hashedPassword })
            .returning({
            id: schema_1.usersTable.id,
            name: schema_1.usersTable.name,
            email: schema_1.usersTable.email,
            age: schema_1.usersTable.age,
            img: schema_1.usersTable.img,
            roleId: schema_1.usersTable.roleId
        });
        return created;
    },
    getById: async (id) => {
        const result = await db_1.db
            .select()
            .from(schema_1.usersTable)
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, id));
        return result[0] ?? null;
    },
    getByEmail: async (email) => {
        const result = await db_1.db
            .select()
            .from(schema_1.usersTable)
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, email));
        return result[0] ?? null;
    },
    getAll: async () => {
        return db_1.db
            .select({
            id: schema_1.usersTable.id,
            name: schema_1.usersTable.name,
            email: schema_1.usersTable.email
        })
            .from(schema_1.usersTable);
    },
    update: async (id, data) => {
        const [updated] = await db_1.db
            .update(schema_1.usersTable)
            .set(data)
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, id))
            .returning();
        return updated ?? null;
    },
    delete: async (id) => {
        const [deleted] = await db_1.db
            .delete(schema_1.usersTable)
            .where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, id))
            .returning();
        return deleted ?? null;
    },
    getRefreshUserToken: async (userId) => {
        const results = await db_1.db
            .select()
            .from(schema_1.userTokensTable)
            .where((0, drizzle_orm_1.eq)(schema_1.userTokensTable.userId, userId));
        const storedToken = results[0] ?? null;
        return storedToken;
    },
    createRefreshUserToken: async (data) => {
        const result = await db_1.db.insert(schema_1.userTokensTable).values(data);
        return result;
    },
    getPermissionsByRoleId: async (roleId) => {
        const result = await db_1.db.execute((0, drizzle_orm_1.sql) `
			SELECT array_agg(${schema_1.permissions.name}) AS permissions
			FROM ${schema_1.role_permissions}
			LEFT JOIN ${schema_1.permissions}
			ON ${schema_1.role_permissions.permissionId} = ${schema_1.permissions.id}
			WHERE ${schema_1.role_permissions.roleId} = ${roleId}
		`);
        return result.rows[0]?.permissions ?? [];
    }
};
