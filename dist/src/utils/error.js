"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const throwError = (message, statusCode = 400) => {
    throw new AppError(message, statusCode);
};
exports.throwError = throwError;
