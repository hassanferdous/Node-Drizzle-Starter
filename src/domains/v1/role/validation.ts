import { z } from "zod";

// Schema for creating a new row
export const createSchema = z.object({
	name: z
		.string({ message: "Name is requried" })
		.min(3, "Name must be at lest 3 characters and unique")
});

export const addPermissionSchema = z.object({
	permissions: z
		.array(z.number({ message: "Permission is required" }))
		.min(1, "At lest permission")
});
