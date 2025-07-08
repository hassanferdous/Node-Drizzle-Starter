"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema_1 = require("./db/schema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_orm_1 = require("drizzle-orm");
const db = (0, node_postgres_1.drizzle)(process.env.DATABASE_URL);
async function seedDefaultRolesAndPermissions() {
    // 1. Seed roles
    const roleNames = ["admin", "user"];
    const existingRoles = await db.select().from(schema_1.roles);
    const roleMap = {};
    for (const roleName of roleNames) {
        let role = existingRoles.find((r) => r.name === roleName);
        if (!role) {
            const inserted = await db
                .insert(schema_1.roles)
                .values({ name: roleName })
                .returning();
            role = inserted[0];
        }
        roleMap[roleName] = role.id;
    }
    // 2. Seed permissions
    const permissionNames = [
        "create_user",
        "delete_user",
        "view_user",
        "manage_roles"
    ];
    const existingPermissions = await db.select().from(schema_1.permissions);
    const permissionMap = {};
    for (const permName of permissionNames) {
        let perm = existingPermissions.find((p) => p.name === permName);
        if (!perm) {
            const inserted = await db
                .insert(schema_1.permissions)
                .values({ name: permName })
                .returning();
            perm = inserted[0];
        }
        permissionMap[perm.name] = perm.id;
    }
    // 3. Assign permissions to "admin" role
    const adminRoleId = roleMap["admin"];
    const existingRolePerms = await db
        .select()
        .from(schema_1.role_permissions)
        .where((0, drizzle_orm_1.eq)(schema_1.role_permissions.roleId, adminRoleId));
    const existingPermissionIds = existingRolePerms.map((rp) => rp.permissionId);
    const newRolePermissions = Object.values(permissionMap)
        .filter((pid) => !existingPermissionIds.includes(pid))
        .map((pid) => ({
        roleId: adminRoleId,
        permissionId: pid
    }));
    if (newRolePermissions.length > 0) {
        await db.insert(schema_1.role_permissions).values(newRolePermissions);
    }
    // 4. Seed default admin user
    const defaultAdminEmail = "admin@example.com";
    const existingAdmin = await db
        .select()
        .from(schema_1.usersTable)
        .where((0, drizzle_orm_1.eq)(schema_1.usersTable.email, defaultAdminEmail));
    if (existingAdmin.length === 0) {
        const salt = await bcryptjs_1.default.genSalt(Number(process.env.HASH_SALT));
        const hashedPassword = await bcryptjs_1.default.hash("test1234", salt);
        await db.insert(schema_1.usersTable).values({
            name: "Admin",
            email: defaultAdminEmail,
            password: hashedPassword,
            roleId: adminRoleId
        });
        console.log("✅ Default admin user created.");
    }
    else {
        console.log("ℹ️ Default admin user already exists.");
    }
    console.log("✅ Roles and permissions seeded successfully.");
}
async function main() {
    await seedDefaultRolesAndPermissions();
    process.exit(0);
}
main();
