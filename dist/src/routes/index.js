"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_1 = __importDefault(require("@domains/v1/blog"));
const auth_1 = __importDefault(require("@domains/v1/auth"));
const user_1 = __importDefault(require("@domains/v1/user"));
const error_1 = require("@/utils/error");
const response_1 = require("@/utils/response");
const router = (0, express_1.Router)();
function defaultRoutes(expressRouter) {
    expressRouter.get("/health", (req, res) => {
        (0, response_1.sendSuccess)(res, {}, 200, "Ok");
    });
    expressRouter.use((req, res) => {
        (0, error_1.throwError)("Route not found", 401);
    });
}
function defineRoutes(expressRouter) {
    // exampleRoutes(expressRouter);
    (0, auth_1.default)(expressRouter);
    (0, user_1.default)(expressRouter);
    (0, blog_1.default)(expressRouter);
    // default routers
    defaultRoutes(expressRouter);
}
defineRoutes(router);
exports.default = router;
