import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { permissions, role_permissions, roles, usersTable } from "./db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
const db = drizzle(process.env.DATABASE_URL!);

async function seedDefaultRolesAndPermissions() {
	// 1. Seed roles
	const roleNames = ["admin", "user"];
	const existingRoles = await db.select().from(roles);

	const roleMap: Record<string, number> = {};

	for (const roleName of roleNames) {
		let role = existingRoles.find((r) => r.name === roleName);
		if (!role) {
			const inserted = await db
				.insert(roles)
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

	const existingPermissions = await db.select().from(permissions);
	const permissionMap: Record<string, number> = {};

	for (const permName of permissionNames) {
		let perm = existingPermissions.find((p) => p.name === permName);
		if (!perm) {
			const inserted = await db
				.insert(permissions)
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
		.from(role_permissions)
		.where(eq(role_permissions.roleId, adminRoleId));

	const existingPermissionIds = existingRolePerms.map((rp) => rp.permissionId);

	const newRolePermissions = Object.values(permissionMap)
		.filter((pid) => !existingPermissionIds.includes(pid))
		.map((pid) => ({
			roleId: adminRoleId,
			permissionId: pid
		}));

	if (newRolePermissions.length > 0) {
		await db.insert(role_permissions).values(newRolePermissions);
	}

	// 4. Seed default admin user
	const defaultAdminEmail = "admin@example.com";
	const existingAdmin = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.email, defaultAdminEmail));

	if (existingAdmin.length === 0) {
		const salt = await bcrypt.genSalt(
			Number(process.env.HASH_SALT as string)
		);
		const hashedPassword = await bcrypt.hash("test1234", salt);
		await db.insert(usersTable).values({
			name: "Admin",
			email: defaultAdminEmail,
			password: hashedPassword,
			roleId: adminRoleId
		});
		console.log("✅ Default admin user created.");
	} else {
		console.log("ℹ️ Default admin user already exists.");
	}

	console.log("✅ Roles and permissions seeded successfully.");
}

async function main() {
	await seedDefaultRolesAndPermissions();
	process.exit(0);
}

main();
