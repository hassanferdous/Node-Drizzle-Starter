import { Router } from "express";
import { UserController } from "./user.controller";
import verifyAuth from "../../../middlewares/auth.middleware";

const router = Router();

router.get("/", verifyAuth, UserController.getUsers);
router.post("/", verifyAuth, UserController.createUsers);

export default router;
