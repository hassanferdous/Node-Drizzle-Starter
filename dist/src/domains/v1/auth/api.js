"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = require("./service");
const router = express_1.default.Router();
// Credential Login
router.post("/login/credential", service_1.services.credentialLogin);
router.post("/refresh-token", service_1.services.verfifyRefreshToken);
exports.default = router;
