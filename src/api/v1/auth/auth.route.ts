import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/login/credential", AuthController.credential);

export default router;
