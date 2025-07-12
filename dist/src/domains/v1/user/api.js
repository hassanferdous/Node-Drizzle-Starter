"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = require("./service");
const response_1 = require("../../../utils/response");
const auth_middleware_1 = __importDefault(require("../../../middlewares/auth.middleware"));
const authorize_middleware_1 = __importDefault(require("../../../middlewares/authorize.middleware"));
const router = express_1.default.Router();
// Create
router.post("/", auth_middleware_1.default, (0, authorize_middleware_1.default)(["create_user"]), async (req, res) => {
    const data = await service_1.services.create(req.body);
    (0, response_1.sendSuccess)(res, data, 201, "Successfully created new user!");
});
// Read all
router.get("/", auth_middleware_1.default, (0, authorize_middleware_1.default)(["create_user"]), async (req, res) => {
    const data = await service_1.services.getAll();
    (0, response_1.sendSuccess)(res, data, 200, "Successfully fetched all user!");
});
// Read one
router.get("/:id", async (req, res) => {
    const id = +req.params.id;
    const data = await service_1.services.getById(id);
    (0, response_1.sendSuccess)(res, data, 200, "Successfully fetched user!");
});
// Update
router.put("/:id", async (req, res) => {
    const id = +req.params.id;
    await service_1.services.update(id, req.body);
    const data = await service_1.services.getById(id);
    (0, response_1.sendSuccess)(res, data, 200, "Successfully updated user!");
});
// Delete
router.delete("/:id", async (req, res) => {
    const id = +req.params.id;
    const data = await service_1.services.delete(id);
    (0, response_1.sendSuccess)(res, data, 200, "Successfully deleted user!");
});
exports.default = router;
