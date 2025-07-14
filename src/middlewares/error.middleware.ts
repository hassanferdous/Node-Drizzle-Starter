import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";

export const errorHandler = (
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			data: null,
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
