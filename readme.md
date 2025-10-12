# 🚀 Express API v1 — Monolithic Backend

A modern **Express.js + TypeScript** backend powered by **Drizzle ORM**, **PostgreSQL**, **Zod**, **Passport (Local + Google OAuth)**, and **Winston logger**.  
This project follows a **domain-based modular architecture**, supports **Swagger documentation**, and is fully **Dockerized** for both development and production.

---

## 📁 Project Structure

## Project structure

```
├── .dockerignore
├── .env
├── .env.development
├── .env.example
├── .gitignore
├── .prettierrc
├── Dockerfile
├── README.md
├── compose.yaml
├── drizzle
│   ├── 0000_smart_molten_man.sql
├── drizzle.config.ts
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── logs
│   └── app.log
├── src
│   ├── .DS_Store
│   ├── app.ts
│   ├── config
│   │   ├── .DS_Store
│   │   ├── config.development.json
│   │   ├── db.ts
│   │   ├── env.ts
│   │   └── index.ts
│   ├── db
│   │   ├── common.ts
│   │   └── schema.ts
│   ├── domains
│   │   └── v1
│   │   ├── auth
│   │   │   ├── api.ts
│   │   │   ├── docs.ts
│   │   │   ├── index.ts
│   │   │   ├── passport
│   │   │   │   ├── index.ts
│   │   │   │   ├── strategy.google.ts
│   │   │   │   └── strategy.local.ts
│   │   │   ├── service.ts
│   │   │   └── validation.ts
│   │   └── user
│   │   ├── api.ts
│   │   ├── index.ts
│   │   ├── service.ts
│   │   └── validation.ts
│   ├── index.d.ts
│   ├── lib
│   │   ├── common-zod-schema.ts
│   │   ├── rate-limit.ts
│   │   └── redis.ts
│   ├── middlewares
│   │   ├── auth.middleware.ts
│   │   ├── authorize.middleware.ts
│   │   ├── csrf.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── safe-parse.middleware.ts
│   │   └── validate.middleware.ts
│   ├── routes
│   │   ├── index.ts
│   │   └── view-routes.ts
│   ├── scripts
│   │   └── generate-api.js
│   ├── seed.ts
│   ├── server.ts
│   ├── swagger
│   │   ├── component.schema.ts
│   │   └── index.ts
│   ├── utils
│   │   ├── cookie.ts
│   │   ├── error.ts
│   │   ├── formatZodError.ts
│   │   ├── getCachedOrLoad.ts
│   │   ├── jwt.ts
│   │   ├── password-hash.ts
│   │   └── response.ts
│   └── views
│   ├── index.ejs
│   ├── login-success.ejs
│   └── login.ejs
├── structure.txt
└── tsconfig.json

---
```

## ⚙️ Prerequisites

Make sure you have the following installed:

-  **Node.js ≥ 18**
-  **pnpm ≥ 10**
-  **Docker & Docker Compose**
-  **PostgreSQL** and **Redis** (handled via Docker)

---

## 🧩 Environment Setup

Copy the example file and update your configuration:

```bash
cp .env.example .env
cp .env.example .env.development
```

Example `.env.development`:

```env
# NODE ENVIRONMENT
NODE_ENV=development          # Set to 'development' | 'production'
LOG_LEVEL=info                # Log level: debug, info, warn, error
PORT=8001                     # Application port
HASH_SALT=10                  # Bcrypt salt rounds

# DATABASE & REDIS CONFIGURATION
POSTGRES_DB=<your_database_name>
POSTGRES_USER=<your_database_user>
POSTGRES_PASSWORD=<your_database_password>
REDIS_HOST=<your_redis_host     # e.g., redis or localhost
REDIS_PORT=6379                # Default Redis port

# AUTHENTICATION & JWT
JWT_ACCESSTOKEN_SECRET=<your_access_token_secret_base64>
JWT_REFRESHTOKEN_SECRET=<your_refresh_token_secret_base64>
AUTH_GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
AUTH_GOOGLE_CLIENT_SECRET=<your_google_oauth_client_secret>
ACCESSTOKEN_DURATION=600       # Access token expiry, e.g., 600 (seconds)
REFRESHTOKEN_DURATION=1d       # Refresh token expiry, e.g., 1d (1 day)

# SMTP CONFIGURATION
SMTP_HOST=<your_smtp_host>       # e.g., smtp.ethereal.email or smtp.sendgrid.net
SMTP_PORT=587                  # SMTP port, e.g., 587 or 465
SMTP_USER=<your_smtp_username>   # SMTP account username (email)
SMTP_PASS=<your_smtp_password>   # SMTP account password
SMTP_FROM=<your_email_from_address> # Default sender email, e.g., no-reply@yourdomain.com

```

---

## 🐳 Running the Project

### 🔧 Development Mode

```bash
docker compose --env-file .env.development up --build
```

Then inside the container:

```bash
pnpm install
pnpm dev
```

Or simply run:

```bash
pnpm install:container
```

This runs `docker exec -it drizzle_express pnpm install`.

---

### 🚀 Production Mode

```bash
docker compose --env-file .env up --build -d
```

Then:

```bash
pnpm build
pnpm start
```

This runs the compiled JS files from `dist/`.

---

## 🗃️ Database Setup

### 🔨 Generate Migrations

```bash
pnpm drizzle-kit generate
```

### ⬆️ Apply Migrations

```bash
pnpm drizzle-kit push
```

### 🌱 Seed the Database

```bash
pnpm seed-db
```

This runs `src/seed.ts` to populate initial data.

---

## 🧱 Creating a New Domain

Each **domain** represents a feature module (e.g., `auth`, `user`, `product`). To create a new domain create files and folders as shown below or simply run this command:

```bash
pnpm generate:domain {domain_name}
```

### 1️⃣ Create the Folder

```bash
mkdir -p src/domains/v1/product
```

### 2️⃣ Create Files

Inside `/src/domains/v1/product`:

```
api.ts
index.ts
service.ts
validation.ts
docs.ts
```

### Example:

#### `validation.ts`

```ts
import { z } from "zod";

export const createProductSchema = z.object({
	name: z.string().min(3),
	price: z.number().positive(),
	stock: z.number().int()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
```

#### `service.ts`

```ts
import db from "@/config/db";
import { products } from "@/db/schema";

export const createProduct = async (data: any) => {
	return await db.insert(products).values(data).returning();
};
```

#### `api.ts`

```ts
import { Router } from "express";
import { validate } from "@/middlewares/validate.middleware";
import { createProductSchema } from "./validation";
import * as service from "./service";
import { successResponse } from "@/utils/response";

const router = Router();

router.post("/", validate(createProductSchema), async (req, res, next) => {
	try {
		const product = await service.createProduct(req.body);
		res.status(201).json(successResponse(product, "Product created", 201));
	} catch (error) {
		next(error);
	}
});

export default router;
```

#### `index.ts`

```ts
import { Router } from "express";
import productRouter from "./api";

const router = Router();
router.use("/products", productRouter);
export default router;
```

#### Add to Global Routes

`src/routes/index.ts`:

```ts
import product from "@/domains/v1/product";
router.use("/v1", product);
```

---

## 📘 Swagger Documentation

### ✍️ Add Documentation to a Route

Create `/src/domains/v1/product/docs.ts`:

```ts
/**
 * @swagger
 * /v1/products:
 *   post:
 *     summary: Create a product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       201:
 *         description: Product created successfully
 */
```

Then define your schema in `src/swagger/component.schema.ts`:

```ts
export const productSchemas = {
	CreateProduct: {
		type: "object",
		properties: {
			name: { type: "string" },
			price: { type: "number" },
			stock: { type: "integer" }
		},
		required: ["name", "price", "stock"]
	}
};
```

### ⚙️ Access Swagger UI

```
http://localhost:5000/api-docs
```

---

## 📦 Install a New Package

### Locally

```bash
pnpm add <package-name>
```

### Inside Docker Container

```bash
pnpm install:container
```

---

## 🪵 Logging (Winston)

Logs are managed by **Winston** with daily rotation.  
Typical config lives in `src/utils/logger.ts`:

```ts
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = createLogger({
	level: process.env.NODE_ENV === "development" ? "debug" : "info",
	format: format.combine(format.timestamp(), format.json()),
	transports: [
		new transports.Console({ format: format.simple() }),
		new DailyRotateFile({
			dirname: "logs",
			filename: "%DATE%.log",
			datePattern: "YYYY-MM-DD",
			zippedArchive: true,
			maxFiles: "14d"
		})
	]
});

export default logger;
```

Use it anywhere:

```ts
import logger from "@/utils/logger";
logger.info("Server started");
logger.error("Something went wrong");
```

---

## 🧰 Middlewares Overview

| Middleware                 | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| `auth.middleware.ts`       | Verifies JWT                             |
| `authorize.middleware.ts`  | Role-based access control                |
| `csrf.middleware.ts`       | CSRF protection                          |
| `error.middleware.ts`      | Handles all thrown errors                |
| `validate.middleware.ts`   | Zod schema validation                    |
| `safe-parse.middleware.ts` | Safely parses and handles invalid inputs |

Use them directly in your route definitions.

---

## 🧠 Response Format

All routes follow a consistent format.

**✅ Success:**

```json
{
	"data": { "item": "info" },
	"isSuccess": true,
	"isError": false,
	"message": "Operation successful",
	"status": 200
}
```

**❌ Error:**

```json
{
	"data": {},
	"isSuccess": false,
	"isError": true,
	"message": "Invalid credentials",
	"status": 401
}
```

Utility helpers available in:
`src/utils/response.ts`

---

## 🧭 Common Commands

| Command                              | Description                        |
| ------------------------------------ | ---------------------------------- |
| `pnpm dev`                           | Run development server             |
| `pnpm build`                         | Compile TypeScript                 |
| `pnpm start`                         | Run production build               |
| `pnpm seed-db`                       | Run seed script                    |
| `pnpm generate:domain {domain_name}` | Generate domain files              |
| `pnpm install:container`             | Install dependencies inside Docker |
| `docker compose up --build`          | Start containers                   |
| `docker compose down`                | Stop containers                    |

---

## 🧑‍💻 Developer Notes

-  Use **Zod** for request validation.
-  Keep **Swagger docs** updated for every new route.
-  Use **Drizzle ORM migrations** instead of manual schema changes.
-  Maintain consistent responses via utility helpers.
-  Configure Winston log levels per environment.

---
