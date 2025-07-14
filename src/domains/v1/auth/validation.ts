import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string({ message: "Email is required!" })
		.email("Must be a valid email")
		.nonempty(),
	password: z
		.string({ message: "Password is required" })
		.min(8, "Atlest 8 characters")
		.nonempty()
});
