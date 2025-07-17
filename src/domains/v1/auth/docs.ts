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
 * /auth/refresh-token:
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
