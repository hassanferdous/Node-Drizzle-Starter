import { z } from "zod";

// Schema for creating a new row
export const createSchema = z.object({
	// name: z.string().min(1, "Name is required").max(255, "Name is too long"),
	email: z
		.string()
		.email("Invalid email format")
		.max(255, "Email is too long"),
	password: z
		.string({ message: "Password is required" })
		.min(6, "Password must be at least 6 characters long")
});

export const updateSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(255, "Name is too long")
		.optional(),
	age: z
		.number()
		.int("Age must be an integer")
		.min(0, "Age must be non-negative")
		.optional(),
	email: z
		.string()
		.email("Invalid email format")
		.max(255, "Email is too long")
		.optional(),
	roleId: z.number().optional()
});

export const userPermissionSchema = z.object({
	permission: z.union([
		z
			.array(z.number({ message: "Id is required" }))
			.min(1, "At least 1 item required"),
		z.number({ message: "Id is required" })
	])
});

export const assignRoleSchema = z.object({
	role: z
		.array(z.number({ message: "Id is required" }))
		.min(1, "At least 1 item required")
});
