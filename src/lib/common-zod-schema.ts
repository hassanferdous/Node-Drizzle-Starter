import { z } from "zod";

// Schema for validating an ID parameter~
export const idParamSchema = z.object({
	id: z.string({ message: "Id is required" }).nonempty("Id is required")
});

export const idsSchema = z.array(z.number()).min(1, "At lest 1 item required");
