import { idsSchema } from "@/lib/common-zod-schema";
import { z } from "zod";

// Schema for creating a new row
export const createSchema = z.object({
	permissions: z.union([
		z.object({
			resource: z
				.string({ message: "Resource is required" })
				.nonempty({ message: "Resource is required" })
				.max(255, { message: "Resource is too long" }),
			action: z
				.string({ message: "Action is required" })
				.nonempty({ message: "Action is required" })
				.max(255, { message: "Action is too long" }),
			description: z.string().nullable().optional()
		}),
		z
			.array(
				z.object({
					resource: z
						.string({ message: "Resource is required" })
						.nonempty({ message: "Resource is required" })
						.max(255, { message: "Resource is too long" }),
					action: z
						.string({ message: "Action is required" })
						.nonempty({ message: "Action is required" })
						.max(255, { message: "Action is too long" }),
					description: z.string().nullable().optional()
				})
			)
			.min(1, { message: "At least one item is required" })
	])
});

// Schema for updating a row
export const updateSchema = z.object({
	resource: z
		.string({ message: "Resource is required" })
		.nonempty("Resource is required")
		.max(255, "Resource is too long"),
	action: z
		.string({ message: "Action is required" })
		.nonempty("Action is required")
		.max(255, "Action is too long"),
	description: z.string().nullable().optional()
});

export const multiDeleteSchema = z.object({
	ids: idsSchema
});
