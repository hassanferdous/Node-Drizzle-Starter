"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const db_1 = require("@/config/db");
const schema_1 = require("@/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.services = {
    create: async (data) => {
        const [created] = await db_1.db.insert(schema_1.blogsTable).values(data).returning();
        return created;
    },
    getById: async (id) => {
        const result = await db_1.db
            .select()
            .from(schema_1.blogsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.blogsTable.id, id));
        return result[0] ?? null;
    },
    getAll: async () => {
        return db_1.db.select().from(schema_1.blogsTable);
    },
    update: async (id, data) => {
        const [updated] = await db_1.db
            .update(schema_1.blogsTable)
            .set(data)
            .where((0, drizzle_orm_1.eq)(schema_1.blogsTable.id, id))
            .returning();
        return updated ?? null;
    },
    delete: async (id) => {
        const [deleted] = await db_1.db
            .delete(schema_1.blogsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.blogsTable.id, id))
            .returning();
        return deleted ?? null;
    },
};
