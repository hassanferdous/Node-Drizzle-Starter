import { Router } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {
	ForgotPasswordRequest,
	LoginInput,
	RegisterInput,
	ResetPasswordRequest,
	VerifyOTPRequest
} from "./component.schema";
import { config } from "@/config";
const swaggerRouter = Router();
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Expres Drizzle Starter",
			version: "1.0.0"
		},
		servers: [
			{
				url: `http://localhost:${config.app.port}/api/v1`,
				description: "Dev Server"
			}
		],
		components: {
			schemas: {
				LoginInput,
				RegisterInput,
				VerifyOTPRequest,
				ResetPasswordRequest,
				ForgotPasswordRequest
			}
		}
	},
	apis: ["./src/domains/v1/**/docs.ts"]
};

const swaggerSpec = swaggerJSDoc(options);

swaggerRouter.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default swaggerRouter;
