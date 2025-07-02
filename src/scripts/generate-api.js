const fs = require("fs");
const path = require("path");

const entityName = process.argv[2];

if (!entityName) {
	console.error("❌ Please provide an entity name.");
	process.exit(1);
}

const capitalized = entityName.charAt(0).toUpperCase() + entityName.slice(1);
const baseDir = `src/api/v1/${entityName}`;

if (fs.existsSync(baseDir)) {
	console.error(`❌ Directory already exists: ${baseDir}`);
	process.exit(1);
}

fs.mkdirSync(baseDir, { recursive: true });

// --- controller.ts ---
fs.writeFileSync(
	path.join(baseDir, `${entityName}.controller.ts`),
	`import { Request, Response } from "express";
import { ${capitalized}Service } from "./${entityName}.service";
import { sendSuccess } from "../../../utils/response";
export const ${capitalized}Controller = {
	getAll${capitalized}s: async (_req: Request, res: Response) => {
		const data = await ${capitalized}Service.getAll${capitalized}s();
		return sendSuccess(res, data, 200);
	},
};
`
);

// --- service.ts ---
fs.writeFileSync(
	path.join(baseDir, `${entityName}.service.ts`),
	`import prisma from "../../../config/db";

export const ${capitalized}Service = {
	getAll${capitalized}s: async () => {
		const posts = await prisma.${entityName}.findMany({
			include: {
				author: true,
			},
		});
		return posts;
	},
};
`
);

// --- route.ts ---
fs.writeFileSync(
	path.join(baseDir, `${entityName}.route.ts`),
	`import express from "express";
import { ${capitalized}Controller } from "./${entityName}.controller";

const router = express.Router();

router.get("/", ${capitalized}Controller.getAll${capitalized}s);

export default router;
`
);

// --- schema.ts ---
fs.writeFileSync(
	path.join(baseDir, `${entityName}.schema.ts`),
	`// Write schema here`
);

console.log(`✅ ${capitalized} entity generated in /src/api/v1/${entityName}`);
