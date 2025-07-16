import { NextFunction, Request, Response } from "express";
import { AppError, throwError } from "../utils/error";
import { config } from "@/config";

export const errorHandler = (
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			data: err.initialData,
			isError: true,
			isSuccess: false,
			message: err.message,
			status: err.statusCode
		});
	}

	// Check for PostgreSQL unique constraint violation
	if (err?.cause?.code === "23505") {
		return res.status(409).json({
			isSuccess: false,
			isError: true,
			message: "Duplicate entry violates unique constraint.",
			status: 409,
			data: { constraint: err?.cause?.constraint }
		});
	}

	// fallback for unexpected errors
	res.status(500).json({
		data: null,
		isError: true,
		isSuccess: false,
		message:
			config.app.env === "development"
				? err.message
				: "Internal Server Error",
		status: 500
	});
};

export const entityParseHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err.type === "entity.parse.failed") {
		return throwError("Invalid JSON payload", 400, {});
	}

	next(err);
};
