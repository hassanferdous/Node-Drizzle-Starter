"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = require("./service");
const response_1 = require("@/utils/response");
const router = express_1.default.Router();
// Create
router.post("/", async (req, res) => {
    const data = await service_1.services.create(req.body);
    (0, response_1.sendSuccess)(res, data, 201, "Successfully created new examples!");
});
// Read all
router.get("/", async (req, res) => {
    const data = await service_1.services.getAll();
    (0, response_1.sendSuccess)(res, data, 200, "Successfully fetched examples!");
});
// Read one
router.get("/:id", async (req, res) => {
    const id = +req.params.id;
    const data = await service_1.services.getById(id);
    (0, response_1.sendSuccess)(res, data, 200, "Successfully fetched example!");
});
// Update
router.put("/:id", async (req, res) => {
    const id = +req.params.id;
    await service_1.services.update(id, req.body);
    const data = await service_1.services.getById(id);
    (0, response_1.sendSuccess)(res, data, 200, "Successfully updated example!");
});
// Delete
router.delete("/:id", async (req, res) => {
    const id = +req.params.id;
    const data = await service_1.services.delete(id);
    (0, response_1.sendSuccess)(res, data, 200, "Successfully deleted example!");
});
exports.default = router;
