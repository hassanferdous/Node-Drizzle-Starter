import validate from "@/middlewares/validate.middleware";
import express from "express";
import { AuthServices } from "./service";
import { loginSchema, registerSchema } from "./validation";
import passport from "passport";

const router = express.Router();

// Credential Login
router.post(
	"/credential",
	validate({ body: loginSchema }),
	AuthServices.credentialLogin
);
// Register
router.post(
	"/register",
	validate({ body: registerSchema }),
	AuthServices.register
);

// Google
router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		session: false
	})
);

router.get("/google/callback", AuthServices.callback_google);

// refresh token
router.post("/refresh-token", AuthServices.verfifyRefreshToken);

export default router;
