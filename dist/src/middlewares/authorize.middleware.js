"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authorize;
const error_1 = require("@/utils/error");
function authorize(permissions) {
    return (req, res, next) => {
        const user = req.user;
        const isAllowed = permissions.every((permission) => user.permissions.includes(permission));
        if (!isAllowed) {
            return (0, error_1.throwError)("Forbiden", 403);
        }
        next();
    };
}
