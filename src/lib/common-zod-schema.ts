import { z } from "zod";

// Schema for validating an ID parameter~
export const idParamSchema = z.object({
	id: z.string().regex(/^d+$/, "Invalid ID format")
});
