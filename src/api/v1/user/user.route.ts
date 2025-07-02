import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.get("/", UserController.getUsers);
router.post("/", UserController.createUsers);

export default router;
