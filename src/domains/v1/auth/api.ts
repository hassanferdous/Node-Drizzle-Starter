import express from "express";
import { services } from "./service";
import validate from "@/middlewares/validate.middleware";
import { loginSchema } from "./validation";

const router = express.Router();

// Credential Login
router.post(
	"/login/credential",
	validate({ body: loginSchema }),
	services.credentialLogin
);
router.post("/refresh-token", services.verfifyRefreshToken);

export default router;
