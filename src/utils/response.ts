import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export class AppResponse {
	/**
	 * Sends a success response.
	 * @param res - The Express response object.
	 * @param data - The data to include in the response body. Default is an empty object.
	 * @param status - The HTTP status code. Default is 200 (OK).
	 * @param message - The success message. Default is "Success".
	 */
	static success(
		res: Response,
		data: any = {},
		status = StatusCodes.OK,
		message = "Success"
	) {
		return res.status(status).json({
			data,
			isSuccess: true,
			isError: false,
			message,
			status
		});
	}

	/**
	 * Sends an error response.
	 * @param res - The Express response object.
	 * @param data - The data to include in the response body. Default is an empty object.
	 * @param status - The HTTP status code. Default is 500 (Internal Server Error).
	 * @param message - The error message. Default is "Internal Server Error".
	 */
	static error(
		res: Response,
		data: any = {},
		status = StatusCodes.INTERNAL_SERVER_ERROR,
		message = "Internal Server Error"
	) {
		return res.status(status).json({
			data,
			isSuccess: false,
			isError: true,
			message,
			status
		});
	}

	/**
	 * Sends a bad request response.
	 * @param res - The Express response object.
	 * @param data - The data to include in the response body. Default is an empty object.
	 * @param status - The HTTP status code. Default is 400 (Bad Request).
	 * @param message - The error message. Default is "Bad Request".
	 */
	static badRequest(
		res: Response,
		data: any = {},
		status = StatusCodes.BAD_REQUEST,
		message = "Bad Request"
	) {
		return res.status(status).json({
			data,
			isSuccess: false,
			isError: true,
			message,
			status
		});
	}

	/**
	 * Sends a not found response.
	 * @param res - The Express response object.
	 * @param data - The data to include in the response body. Default is an empty object.
	 * @param status - The HTTP status code. Default is 404 (Not Found).
	 * @param message - The error message. Default is "Not Found".
	 */
	static notFound(
		res: Response,
		data: any = {},
		status = StatusCodes.NOT_FOUND,
		message = "Not Found"
	) {
		return res.status(status).json({
			data,
			isSuccess: false,
			isError: true,
			message,
			status
		});
	}
}
