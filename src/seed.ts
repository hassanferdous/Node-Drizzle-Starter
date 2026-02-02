import bcrypt from "bcryptjs";
import "dotenv/config";
import { InferInsertModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "./config";
import {
	permissions,
	role_permissions,
	roles,
	user_roles,
	usersTable
} from "./db/schema";
const db = drizzle(config.db.uri);

const usersData: InferInsertModel<typeof usersTable>[] = [
	{
		email: "admin@gmail.com",
		password: "password"
	},
	{
		email: "moderator@gmail.com",
		password: "password"
	},
	{
		email: "user@gmail.com",
		password: "password"
	}
];

const rolesData: InferInsertModel<typeof roles>[] = [
	{
		name: "admin",
		description: "Super admin role",
		parentId: null
	},
	{
		name: "moderator",
		description: "Moderator role",
		parentId: 1
	},
	{
		name: "user",
		description: "User role",
		parentId: null
	}
];

const permissionsData: InferInsertModel<typeof permissions>[] = [
	// User Permissions
	{
		subject: "all",
		action: "manage",
		description: "Manage all",
		conditions: null,
		inverted: false
	},
	{
		subject: "User",
		action: "create",
		description: "Create user",
		conditions: null,
		inverted: false
	},
	{
		subject: "User",
		action: "read",
		description: "Read user",
		conditions: null,
		inverted: false
	},
	{
		subject: "User",
		action: "update",
		description: "Update user",
		conditions: null,
		inverted: false
	},
	{
		subject: "User",
		action: "delete",
		description: "Delete user",
		conditions: null,
		inverted: false
	},

	// Role Permissions
	{
		subject: "Role",
		action: "create",
		description: "Create role",
		conditions: null,
		inverted: false
	},
	{
		subject: "Role",
		action: "read",
		description: "Read role",
		conditions: null,
		inverted: false
	},
	{
		subject: "Role",
		action: "update",
		description: "Update role",
		conditions: null,
		inverted: false
	},
	{
		subject: "Role",
		action: "delete",
		description: "Delete role",
		conditions: null,
		inverted: false
	},

	// Permission Permissions
	{
		subject: "Permission",
		action: "create",
		description: "Create permission",
		conditions: null,
		inverted: false
	},
	{
		subject: "Permission",
		action: "read",
		description: "Read permission",
		conditions: null,
		inverted: false
	},
	{
		subject: "Permission",
		action: "update",
		description: "Update permission",
		conditions: null,
		inverted: false
	},
	{
		subject: "Permission",
		action: "delete",
		description: "Delete permission",
		conditions: null,
		inverted: false
	}
];

const userRolesData: InferInsertModel<typeof user_roles>[] = [
	{
		userId: 1,
		roleId: 1,
		scopeType: "global",
		scopeId: null
	},
	{
		userId: 2,
		roleId: 2,
		scopeType: "global",
		scopeId: null
	},
	{
		userId: 3,
		roleId: 3,
		scopeType: "global",
		scopeId: null
	}
];

const rolePermissionsData: InferInsertModel<typeof role_permissions>[] = [
	{
		roleId: 1,
		permissionId: 1
	}
];

async function seedDefaultRolesAndPermissions() {
	// delete all data
	await db.delete(user_roles);
	await db.delete(role_permissions);
	await db.delete(roles);
	await db.delete(permissions);
	await db.delete(usersTable);

	// insert data
	const salt = await bcrypt.genSalt(Number(process.env.HASH_SALT as string));
	const hashedPassword = await bcrypt.hash(usersData[0].password, salt);
	await db.insert(roles).values(rolesData);
	await db.insert(permissions).values(permissionsData);
	await db.insert(role_permissions).values(rolePermissionsData);
	await db.insert(usersTable).values(
		usersData.map((user) => {
			return {
				...user,
				password: hashedPassword
			};
		})
	);
	await db.insert(user_roles).values(userRolesData);
	console.log("✅ Default roles and permissions seeded successfully");
}

async function main() {
	await seedDefaultRolesAndPermissions();
	process.exit(0);
}

main();
