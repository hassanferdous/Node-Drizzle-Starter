import { z } from "zod";

// Schema for creating a new row
export const createSchema = z.object({
	name: z.string().min(1, "Name is required").max(255, "Name is too long"),
	age: z
		.number()
		.int("Age must be an integer")
		.min(0, "Age must be non-negative"),
	email: z
		.string()
		.email("Invalid email format")
		.max(255, "Email is too long"),
});

// Schema for updating a row
export const updateSchema = z.object({
	name: z.string().min(1).max(255).optional(),
	age: z.number().int().min(0).optional(),
	email: z.string().email().max(255).optional(),
});

// Schema for validating an ID parameter~
export const idParamSchema = z.object({
	id: z.string().regex(/^\d+$/, "Invalid ID format"),
});
