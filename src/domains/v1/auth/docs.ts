/**
 * @swagger
 * /auth/credential:
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
 * /auth/register:
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
 * /auth/google:
 *   get:
 *     summary: Google OAuth2 login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth2 consent screen
 */

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google authentication successful
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token with refresh token
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: X-CSRF-Token
 *         schema:
 *           type: string
 *         required: true
 *         description: CSRF token for request validation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               csrfToken:
 *                 type: string
 *                 description: CSRF token (alternative to header)
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 *       403:
 *         description: Missing or invalid CSRF token
 */

/**
 * @swagger
 * /auth/exchange:
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

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOTPRequest'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired reset token
 */
