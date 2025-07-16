import validate from "@/middlewares/validate.middleware";
import express from "express";
import passport from "passport";
import { AuthServices } from "./service";
import { exchageSchema, loginSchema, registerSchema } from "./validation";

const router = express.Router();

/******** Credential Login  ********/
router.post(
	"/credential",
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
router.post("/refresh-token", AuthServices.verfifyRefreshToken);

/******** Exchange token  ********/
router.get(
	"/exchange",
	validate({ query: exchageSchema }),
	AuthServices.exchangeToken
);

export default router;
