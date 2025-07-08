"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = defineRoutes;
const api_1 = __importDefault(require("@domains/v1/auth/api"));
function defineRoutes(expressRouter) {
    expressRouter.use("/auth", api_1.default);
}
