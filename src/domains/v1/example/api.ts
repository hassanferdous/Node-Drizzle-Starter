import express, { Request, Response } from "express";
import { services } from "./service";
import { sendSuccess } from "@/utils/response";

const router = express.Router();

// Create
router.post("/", async (req: Request, res: Response) => {
	const data = await services.create(req.body);
	sendSuccess(res, data, 201, "Successfully created new examples!");
});

// Read all
router.get("/", async (req: Request, res: Response) => {
	const data = await services.getAll();
	sendSuccess(res, data, 200, "Successfully fetched examples!");
});

// Read one
router.get("/:id", async (req: Request, res: Response) => {
	const id = +req.params.id;
	const data = await services.getById(id);
	sendSuccess(res, data, 200, "Successfully fetched example!");
});

// Update
router.put("/:id", async (req: Request, res: Response) => {
	const id = +req.params.id;
	await services.update(id, req.body);
	const data = await services.getById(id);
	sendSuccess(res, data, 200, "Successfully updated example!");
});

// Delete
router.delete("/:id", async (req: Request, res: Response) => {
	const id = +req.params.id;
	const data = await services.delete(id);
	sendSuccess(res, data, 200, "Successfully deleted example!");
});

export default router;
