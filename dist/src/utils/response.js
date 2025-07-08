"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = void 0;
const sendSuccess = (res, data = {}, status = 200, message = "Success") => {
    return res.status(status).json({
        data,
        isSuccess: true,
        isError: false,
        message,
        status,
    });
};
exports.sendSuccess = sendSuccess;
