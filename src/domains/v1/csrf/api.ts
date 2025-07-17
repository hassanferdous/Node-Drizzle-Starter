import { sendSuccess } from "@/utils/response";
import express, { Request, Response } from "express";

const router = express.Router();

// Read all
router.get("/", async (req: Request, res: Response) => {
	sendSuccess(
		res,
		{ csrf_token: req.csrfToken() },
		200,
		"Successfully fetched all csrf!"
	);
});

export default router;
