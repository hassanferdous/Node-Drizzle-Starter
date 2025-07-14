export class AppError extends Error {
	statusCode: number;
	initialData?: any;
	constructor(message: string, statusCode = 500, initialData = {}) {
		super(message);
		this.statusCode = statusCode;
		this.initialData = initialData;
		Error.captureStackTrace(this, this.constructor);
	}
}

export const throwError = (
	message: string,
	statusCode = 400,
	initialData: any = {}
) => {
	throw new AppError(message, statusCode, initialData);
};
