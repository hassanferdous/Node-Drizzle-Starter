import { Request, Response, NextFunction } from "express";
import { AppError, throwError } from "../utils/error";

export const errorHandler = (
	err: unknown,
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

	// fallback for unexpected errors
	res.status(500).json({
		data: null,
		isError: true,
		isSuccess: false,
		message: "Internal Server Error",
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
