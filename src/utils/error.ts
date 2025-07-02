export class AppError extends Error {
	statusCode: number;
	constructor(message: string, statusCode = 500) {
		super(message);
		this.statusCode = statusCode;
		Error.captureStackTrace(this, this.constructor);
	}
}

export const throwError = (message: string, statusCode = 400) => {
	throw new AppError(message, statusCode);
};
