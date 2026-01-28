import { idsSchema } from "@/lib/common-zod-schema";
import { z } from "zod";

// Schema for creating a new row
export const createSchema = z.object({
	permissions: z.union([
		z.object({
			subject: z
				.string({ message: "Subject is required" })
				.nonempty({ message: "Subject is required" })
				.max(255, { message: "Subject is too long" }),
			action: z
				.string({ message: "Action is required" })
				.nonempty({ message: "Action is required" })
				.max(255, { message: "Action is too long" }),
			conditions: z.string().nullable().optional(),
			inverted: z.boolean().nullable().optional(),
			description: z.string().nullable().optional()
		}),
		z
			.array(
				z.object({
					subject: z
						.string({ message: "Subject is required" })
						.nonempty({ message: "Subject is required" })
						.max(255, { message: "Subject is too long" }),
					action: z
						.string({ message: "Action is required" })
						.nonempty({ message: "Action is required" })
						.max(255, { message: "Action is too long" }),
					conditions: z.string().nullable().optional(),
					inverted: z.boolean().nullable().optional(),
					description: z.string().nullable().optional()
				})
			)
			.min(1, { message: "At least one item is required" })
	])
});

// Schema for updating a row
export const updateSchema = z.object({
	subject: z
		.string({ message: "Subject is required" })
		.nonempty("Subject is required")
		.max(255, "Subject is too long"),
	action: z
		.string({ message: "Action is required" })
		.nonempty("Action is required")
		.max(255, "Action is too long"),
	conditions: z.string().optional(),
	inverted: z.boolean().optional(),
	description: z.string().nullable().optional()
});

export const multiDeleteSchema = z.object({
	ids: idsSchema
});
