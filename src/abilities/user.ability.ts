import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { AuthSession } from "../types";

export type Actions = "read" | "create" | "update" | "delete" | "manage";
export type Subjects = "User" | "all";

export function defineUserAbility(session?: AuthSession) {
	const { can, build } = new AbilityBuilder(createMongoAbility);

	const roleNames = session?.roles?.map((r) => r.name) || [];
	const permissions = session?.permissions?.map((p) => ({
		action: p.action,
		resource: p.resource
	}));

	// for (const perm of permissions || []) {
	// 	can(perm.action, perm.resource);
	// }

	// Conditional rules for super_admin and admin
	if (roleNames.includes("super_admin")) {
		can("manage", "all");
	}

	if (roleNames.includes("admin")) {
		can("manage", "User");
		can("manage", "Role");
	}

	// Conditional rules for instructors
	if (roleNames.includes("instructor")) {
		can("update", "Course", { instructorId: session?.user.id });
	}

	// Conditional rules for students
	if (roleNames.includes("student")) {
		can("read", "User", { id: session?.user.id });
	}

	return build({
		detectSubjectType: (object) => object.resource
	});
}
