"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, type = "both") => {
    let tokens = {};
    switch (type) {
        case "both":
            tokens.access_token = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESSTOKEN_SECRET, {
                expiresIn: process.env.ACCESSTOKEN_DURATION,
            });
            tokens.refresh_token = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESHTOKEN_SECRET, {
                expiresIn: process.env.REFRESHTOKEN_DURATION,
            });
            break;
        case "access":
            tokens.access_token = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESSTOKEN_SECRET, {
                expiresIn: process.env.ACCESSTOKEN_DURATION,
            });
            break;
        case "refresh":
            tokens.refresh_token = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESHTOKEN_SECRET, {
                expiresIn: process.env.REFRESHTOKEN_DURATION,
            });
            break;
    }
    return tokens;
};
exports.generateToken = generateToken;
const verifyToken = (token, type = "access") => {
    const secret = type === "access"
        ? process.env.JWT_ACCESSTOKEN_SECRET
        : process.env.JWT_REFRESHTOKEN_SECRET;
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    return decoded;
};
exports.verifyToken = verifyToken;
