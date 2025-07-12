"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, type = "both") => {
    let tokens = {};
    switch (type) {
        case "both":
            tokens.access_token = jsonwebtoken_1.default.sign(payload, config_1.config.auth.jwtAccessTokenSecret, {
                expiresIn: config_1.config.auth.accessTokenDuration
            });
            tokens.refresh_token = jsonwebtoken_1.default.sign(payload, config_1.config.auth.jwtRefreshTokenSecret, {
                expiresIn: config_1.config.auth.refreshTokenDuration
            });
            break;
        case "access":
            tokens.access_token = jsonwebtoken_1.default.sign(payload, config_1.config.auth.jwtAccessTokenSecret, {
                expiresIn: config_1.config.auth.accessTokenDuration
            });
            break;
        case "refresh":
            tokens.refresh_token = jsonwebtoken_1.default.sign(payload, config_1.config.auth.jwtRefreshTokenSecret, {
                expiresIn: config_1.config.auth.refreshTokenDuration
            });
            break;
    }
    return tokens;
};
exports.generateToken = generateToken;
const verifyToken = (token, type = "access") => {
    const secret = type === "access"
        ? config_1.config.auth.jwtAccessTokenSecret
        : config_1.config.auth.jwtRefreshTokenSecret;
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    return decoded;
};
exports.verifyToken = verifyToken;
