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
