import { idsSchema } from "@/lib/common-zod-schema";
import { z } from "zod";

// Schema for creating a new row
export const createSchema = z.object({
	permissions: z.union([
		z.object({
			name: z
				.string({ message: "Name is required" })
				.nonempty({ message: "Name is required" })
				.max(255, { message: "Name is too long" }),
			description: z.string().nullable().optional()
		}),
		z
			.array(
				z.object({
					name: z
						.string({ message: "Name is required" })
						.nonempty({ message: "Name is required" })
						.max(255, { message: "Name is too long" }),
					description: z.string().nullable().optional()
				})
			)
			.min(1, { message: "At least one item is required" })
	])
});

// Schema for updating a row
export const updateSchema = z.object({
	name: z
		.string({ message: "Name is required" })
		.nonempty("Name is required")
		.max(255, "Name is too long"),
	description: z.string().nullable().optional()
});

export const multiDeleteSchema = z.object({
	ids: idsSchema
});
