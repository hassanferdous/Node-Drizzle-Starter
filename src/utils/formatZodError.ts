// utils/formatZodError.ts
import { ZodError } from "zod";

export const formatZodError = (error: ZodError) => {
	return error.errors.map((err) => ({
		field: err.path.join("."),
		message: err.message
	}));
};
