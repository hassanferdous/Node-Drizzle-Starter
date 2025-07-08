"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    const status = err.statusCode || 500;
    res.status(status).json({
        data: null,
        isError: true,
        isSuccess: false,
        message: err.message || "Internal server error",
        status,
    });
};
exports.errorHandler = errorHandler;
