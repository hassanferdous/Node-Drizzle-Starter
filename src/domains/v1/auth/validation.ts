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

export const registerSchema = z.object({
	name: z
		.string({ message: "Name is required" })
		.min(3, "Minimum 3 characters"),
	email: z
		.string({ message: "Email is required!" })
		.email("Must be a valid email")
		.nonempty(),
	password: z
		.string({ message: "Password is required" })
		.min(8, "Atlest 8 characters")
		.nonempty()
});

export const exchageSchema = z.object({
	code: z
		.string({ message: "Missing code" })
		.uuid("Invalid code")
		.nonempty("Missing code")
});

export const forgotPasswordSchema = z.object({
	email: z.string().email().nonempty("Email is required")
});

export const verifyOTPSchema = z.object({
	email: z.string().email().nonempty("Email is required"),
	otp: z.string().length(6, "Must be 6 characters")
});

export const resetPasswordSchema = z.object({
	newPassword: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.nonempty("Password is required"),
	token: z.string().nonempty("Password is required")
});
