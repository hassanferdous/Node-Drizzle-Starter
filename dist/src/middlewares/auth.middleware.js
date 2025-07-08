"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = auth;
const jwt_1 = require("../utils/jwt");
const error_1 = require("../utils/error");
function auth(req, res, next) {
    const cookies = req.cookies;
    const headers = req.headers;
    const access_token = cookies.access_token ?? headers.authorization?.replace("Bearer ", "");
    try {
        const decoded = (0, jwt_1.verifyToken)(access_token, "access");
        req.user = decoded.user;
        next();
    }
    catch (error) {
        (0, error_1.throwError)("Invalid Token", 401);
    }
}
