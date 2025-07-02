import { Response } from "express";

export const sendSuccess = (
	res: Response,
	data: any = {},
	status = 200,
	message = "Success"
) => {
	return res.status(status).json({
		data,
		isSuccess: true,
		isError: false,
		message,
		status,
	});
};
