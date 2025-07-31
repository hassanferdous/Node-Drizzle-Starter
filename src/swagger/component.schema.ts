export const LoginInput = {
	type: "object",
	required: ["email", "password"],
	properties: {
		email: {
			type: "string",
			format: "email",
			example: "user@example.com"
		},
		password: {
			type: "string",
			format: "password",
			example: "MySecurePassword123"
		}
	}
};
export const RegisterInput = {
	type: "object",
	required: ["name", "email", "password"],
	properties: {
		name: {
			type: "string",
			example: "John Doe"
		},
		email: {
			type: "string",
			format: "email",
			example: "john@example.com"
		},
		password: {
			type: "string",
			format: "password",
			example: "MySecurePassword123"
		}
	}
};

export const VerifyOTPRequest = {
	type: "object",
	required: ["email", "otp"],
	properties: {
		email: {
			type: "string",
			format: "email",
			example: "user@example.com"
		},
		otp: {
			type: "string",
			example: "123456"
		}
	}
};

export const ResetPasswordRequest = {
	type: "object",
	required: ["email", "token", "newPassword"],
	properties: {
		email: {
			type: "string",
			format: "email",
			example: "user@example.com"
		},
		token: {
			type: "string",
			example: "reset-token-123"
		},
		newPassword: {
			type: "string",
			format: "password",
			example: "NewSecurePassword123"
		}
	}
};
export const ForgotPasswordRequest = {
	type: "object",
	required: ["email"],
	properties: {
		email: {
			type: "string",
			format: "email",
			example: "user@example.com"
		}
	}
};
