import { relations } from "drizzle-orm/relations";
import { roles, users, userTokens, rolePermissions, permissions, userRoles } from "./schema";

export const rolesRelations = relations(roles, ({one, many}) => ({
	role: one(roles, {
		fields: [roles.parentId],
		references: [roles.id],
		relationName: "roles_parentId_roles_id"
	}),
	roles: many(roles, {
		relationName: "roles_parentId_roles_id"
	}),
	rolePermissions: many(rolePermissions),
	userRoles: many(userRoles),
}));

export const userTokensRelations = relations(userTokens, ({one}) => ({
	user: one(users, {
		fields: [userTokens.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userTokens: many(userTokens),
	userRoles: many(userRoles),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({one}) => ({
	role: one(roles, {
		fields: [rolePermissions.roleId],
		references: [roles.id]
	}),
	permission: one(permissions, {
		fields: [rolePermissions.permissionId],
		references: [permissions.id]
	}),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({one}) => ({
	user: one(users, {
		fields: [userRoles.userId],
		references: [users.id]
	}),
	role: one(roles, {
		fields: [userRoles.roleId],
		references: [roles.id]
	}),
}));