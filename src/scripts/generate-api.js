const fs = require("fs");
const path = require("path");

const collectionName = process.argv[2];

if (!collectionName) {
	console.error("❌ Please provide an collection name.");
	process.exit(1);
}

const capitalized =
	collectionName.charAt(0).toUpperCase() + collectionName.slice(1);
const baseDir = `src/domains/v1/${collectionName}`;

if (fs.existsSync(baseDir)) {
	console.error(`❌ Directory already exists: ${baseDir}`);
	process.exit(1);
}

fs.mkdirSync(baseDir, { recursive: true });

// --- api.ts ---
fs.writeFileSync(
	path.join(baseDir, `api.ts`),
	`import express, { Request, Response } from "express";
import { services } from "./service";
import { sendSuccess } from "@/utils/response";

const router = express.Router();

// Create
router.post("/", async (req: Request, res: Response) => {
	const data = await services.create(req.body);
	sendSuccess(res, data, 201, "Successfully created new ${collectionName}!");
});

// Read all
router.get("/", async (req: Request, res: Response) => {
	const data = await services.getAll();
	sendSuccess(res, data, 200, "Successfully fetched all ${collectionName}!");
});

// Read one
router.get("/:id", async (req: Request, res: Response) => {
	const id = +req.params.id;
	const data = await services.getById(id);
	sendSuccess(res, data, 200, "Successfully fetched ${collectionName}!");
});

// Update
router.put("/:id", async (req: Request, res: Response) => {
	const id = +req.params.id;
	await services.update(id, req.body);
	const data = await services.getById(id);
	sendSuccess(res, data, 200, "Successfully updated ${collectionName}!");
});

// Delete
router.delete("/:id", async (req: Request, res: Response) => {
	const id = +req.params.id;
	const data = await services.delete(id);
	sendSuccess(res, data, 200, "Successfully deleted ${collectionName}!");
});

export default router;
`
);

// --- service.ts ---
fs.writeFileSync(
	path.join(baseDir, `service.ts`),
	`import { db } from "@/config/db";
import { ${collectionName}sTable } from "@/db/schema";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

type ${capitalized} = InferSelectModel<typeof ${collectionName}sTable>;
type New${capitalized} = InferInsertModel<typeof ${collectionName}sTable>;

export const services = {
	create: async (data: New${capitalized}): Promise<${capitalized}> => {
		const [created] = await db.insert(${collectionName}sTable).values(data).returning();
		return created;
	},

	getById: async (id: number): Promise<${capitalized} | null> => {
		const result = await db
			.select()
			.from(${collectionName}sTable)
			.where(eq(${collectionName}sTable.id, id));
		return result[0] ?? null;
	},

	getAll: async (): Promise<${capitalized}[]> => {
		return db.select().from(${collectionName}sTable);
	},

	update: async (id: number, data: New${capitalized}): Promise<${capitalized} | null> => {
		const [updated] = await db
			.update(${collectionName}sTable)
			.set(data)
			.where(eq(${collectionName}sTable.id, id))
			.returning();
		return updated ?? null;
	},

	delete: async (id: number): Promise<${capitalized} | null> => {
		const [deleted] = await db
			.delete(${collectionName}sTable)
			.where(eq(${collectionName}sTable.id, id))
			.returning();
		return deleted ?? null;
	},
};
`
);

// --- index.ts ---
fs.writeFileSync(
	path.join(baseDir, `index.ts`),
	`import router from "@domains/v1/${collectionName}/api";
import { Router } from "express";
export default function defineRoutes(expressRouter: Router) {
	expressRouter.use("/${collectionName}s", router);
};
`
);

// --- schema.ts ---
fs.writeFileSync(
	path.join(baseDir, `schema.ts`),
	`import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const ${collectionName}sTable = pgTable("${collectionName}s", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
});
`
);

// --- validation.ts ---
fs.writeFileSync(
	path.join(baseDir, `validation.ts`),
	`import { z } from "zod";

// Schema for creating a new row
export const createSchema = z.object({
	name: z.string().min(1, "Name is required").max(255, "Name is too long"),
	age: z
		.number()
		.int("Age must be an integer")
		.min(0, "Age must be non-negative"),
	email: z
		.string()
		.email("Invalid email format")
		.max(255, "Email is too long"),
});

// Schema for updating a row
export const updateSchema = z.object({
	name: z.string().min(1).max(255).optional(),
	age: z.number().int().min(0).optional(),
	email: z.string().email().max(255).optional(),
});

// Schema for validating an ID parameter~
export const idParamSchema = z.object({
	id: z.string().regex(/^\d+$/, "Invalid ID format"),
});

`
);

console.log(
	`✅ ${capitalized} api generated in /src/domains/v1/${collectionName}`
);
