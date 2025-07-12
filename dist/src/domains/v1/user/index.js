"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = defineRoutes;
const api_1 = __importDefault(require("../../v1/user/api"));
function defineRoutes(expressRouter) {
    expressRouter.use("/users", api_1.default);
}
