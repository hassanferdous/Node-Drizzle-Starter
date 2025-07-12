"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const cookie_1 = require("../../../utils/cookie");
const error_1 = require("../../../utils/error");
const jwt_1 = require("../../../utils/jwt");
const response_1 = require("../../../utils/response");
const service_1 = require("../../v1/user/service");
const passport_1 = __importDefault(require("passport"));
exports.services = {
    credentialLogin: (req, res, next) => {
        passport_1.default.authenticate("local", { session: false }, async (err, user, info) => {
            if (err)
                return next(err);
            if (!user) {
                (0, error_1.throwError)(info?.message || "Invalid credentials", 401);
            }
            const permissions = await service_1.services.getPermissionsByRoleId(user.roleId);
            const userWithPermision = { ...user, permissions };
            const tokens = (0, jwt_1.generateToken)({ user: userWithPermision });
            (0, cookie_1.setAuthCookies)(res, tokens);
            const responseData = {
                user: userWithPermision,
                ...tokens
            };
            await service_1.services.createRefreshUserToken({
                userId: user.id,
                refreshToken: tokens.refresh_token
            });
            // Success — you can return user data or generate JWT
            return (0, response_1.sendSuccess)(res, responseData, 200, "Login successful");
        })(req, res, next);
    },
    verfifyRefreshToken: async (req, res, next) => {
        const cookies = req.cookies;
        const headers = req.headers;
        const token = cookies.refresh_token ?? headers["x-refresh-token"];
        if (!token)
            return (0, error_1.throwError)("Refresh token not found", 403);
        const refresh_token = token;
        if (!refresh_token)
            return (0, error_1.throwError)("Malformed refresh token", 401);
        try {
            const decodeded = (0, jwt_1.verifyToken)(token, "refresh");
            console.log({ decodeded });
            if (decodeded.exp > Date.now())
                return (0, error_1.throwError)("Invalid Token", 401);
            const storedToken = await service_1.services.getRefreshUserToken(decodeded.user.id);
            if (!storedToken)
                return (0, error_1.throwError)("Refresh token not found", 403);
            const new_token = (0, jwt_1.generateToken)({ user: decodeded.user }, "access");
            (0, cookie_1.setAuthCookies)(res, { access_token: new_token.access_token });
            return (0, response_1.sendSuccess)(res, {
                access_token: new_token.access_token
            }, 201, "Successfully generated Access Token!!");
        }
        catch (error) {
            (0, error_1.throwError)("Invalid Token", 401);
        }
    }
};
