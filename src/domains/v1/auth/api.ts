import validate from "@/middlewares/validate.middleware";
import express from "express";
import passport from "passport";
import { AuthServices } from "./service";
import {
	exchageSchema,
	forgotPasswordSchema,
	loginSchema,
	registerSchema,
	resetPasswordSchema,
	verifyOTPSchema
} from "./validation";
import csrfProtection from "@/middlewares/csrf.middleware";
import rateLimit from "@/lib/rate-limit";

const router = express.Router();

const authLimiter = rateLimit({
	windowMs: 10 * 60,
	limit: 5,
	message: {
		status: 429,
		isError: true,
		isSuccess: false,
		message: "Too many login attempts, please try again after 15 minutes.",
		data: {}
	}
});

const otpLimiter = rateLimit({
	windowMs: 15 * 60,
	limit: 3,
	message: {
		status: 429,
		isError: true,
		isSuccess: false,
		message: "Too many login attempts, please try again after 15 minutes.",
		data: {}
	}
});

/******** Credential Login  ********/
router.post(
	"/credential",
	authLimiter,
	validate({ body: loginSchema }),
	AuthServices.callback_credential
);

/******** Register new user  ********/
router.post(
	"/register",
	validate({ body: registerSchema }),
	AuthServices.register
);

/******** Callback Google  ********/
router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		session: false
	})
);
/******** verify refresh token  ********/
router.get("/google/callback", AuthServices.callback_google);

/******** refresh token  ********/
router.post("/refresh-token", csrfProtection, AuthServices.verfifyRefreshToken);

/******** Exchange token  ********/
router.get(
	"/exchange",
	validate({ query: exchageSchema }),
	AuthServices.exchangeToken
);

router.post(
	"/forgot-password",
	// otpLimiter,
	validate({ body: forgotPasswordSchema }),
	AuthServices.forgotPassword
);

router.post(
	"/verify-otp",
	// otpLimiter,
	validate({ body: verifyOTPSchema }),
	AuthServices.verifyOTPHandler
);

router.post(
	"/reset-password",
	// otpLimiter,
	validate({ body: resetPasswordSchema }),
	AuthServices.resetPassword
);

export default router;
