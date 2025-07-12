"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("../domains/v1/user/service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
passport_1.default.use(new passport_local_1.Strategy(async function (email, password, cb) {
    const user = await service_1.services.getByEmail(email);
    if (!user) {
        return cb(null, false, { message: "Incorrect email or password." });
    }
    const isMatched = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatched) {
        return cb(null, false, { message: "Incorrect email or password." });
    }
    const { password: userPassword, img, age, ...santizedUser } = user;
    return cb(null, santizedUser);
}));
