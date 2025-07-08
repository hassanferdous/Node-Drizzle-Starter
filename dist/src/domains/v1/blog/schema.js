"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.blogsTable = (0, pg_core_1.pgTable)("blogs", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    age: (0, pg_core_1.integer)().notNull(),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
});
