// middlewares/jsonBodyParser.ts
import express from "express";

export const safeJsonParser = express.json({
	verify: (req, res, buf) => {
		if (buf.length === 0) {
			// Make body empty object instead of failing
			(req as any).body = {};
		}
	}
});
