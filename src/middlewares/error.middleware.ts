import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";

export const errorHandler = (
	err: AppError,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	const status = err.statusCode || 500;

	res.status(status).json({
		data: null,
		isError: true,
		isSuccess: false,
		message: err.message || "Internal server error",
		status,
	});
};
