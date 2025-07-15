import validate from "@/middlewares/validate.middleware";
import express from "express";
import { services } from "./service";
import { loginSchema, registerSchema } from "./validation";
import passport from "passport";
import { sendSuccess } from "@/utils/response";

const router = express.Router();

// Credential Login
router.post(
	"/credential",
	validate({ body: loginSchema }),
	services.credentialLogin
);
// Register
router.post("/register", validate({ body: registerSchema }), services.register);

// Google
router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		session: false
	})
);

router.get("/google/callback", services.callback_google);

// refresh token
router.post("/refresh-token", services.verfifyRefreshToken);

export default router;
