/**
 * @swagger
 * /api/v1/auth/credential:
 *   post:
 *     summary: Login with credentials (email & password)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Google OAuth2 login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth2 consent screen
 */

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google authentication successful
 */

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token with refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */

/**
 * @swagger
 * /api/v1/auth/exchange:
 *   get:
 *     summary: Exchange one-time code for access token
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: One-time exchange code
 *     responses:
 *       200:
 *         description: Token exchanged successfully
 *       400:
 *         description: Validation error
 */

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
