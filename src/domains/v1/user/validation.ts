import { z } from "zod";

// Schema for creating a new row
export const createSchema = z.object({
	name: z.string().min(1, "Name is required").max(255, "Name is too long"),
	age: z
		.number()
		.int("Age must be an integer")
		.min(0, "Age must be non-negative"),
	email: z.string().email("Invalid email format").max(255, "Email is too long")
});
