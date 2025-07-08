"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.updateSchema = exports.createSchema = void 0;
const zod_1 = require("zod");
// Schema for creating a new row
exports.createSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").max(255, "Name is too long"),
    age: zod_1.z
        .number()
        .int("Age must be an integer")
        .min(0, "Age must be non-negative"),
    email: zod_1.z
        .string()
        .email("Invalid email format")
        .max(255, "Email is too long"),
});
// Schema for updating a row
exports.updateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255).optional(),
    age: zod_1.z.number().int().min(0).optional(),
    email: zod_1.z.string().email().max(255).optional(),
});
// Schema for validating an ID parameter~
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^d+$/, "Invalid ID format"),
});
