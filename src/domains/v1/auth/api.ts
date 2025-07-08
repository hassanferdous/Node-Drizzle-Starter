import express from "express";
import { services } from "./service";

const router = express.Router();

// Credential Login
router.post("/login/credential", services.credentialLogin);
router.post("/refresh-token", services.verfifyRefreshToken);

export default router;
