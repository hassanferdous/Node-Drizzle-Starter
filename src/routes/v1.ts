import { Router } from "express";
import userRoutes from "../api/v1/user/user.route";
import postRoutes from "../api/v1/post/post.route";
import authRoutes from "../api/v1/auth/auth.route";

const router = Router();

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/auth", authRoutes);

export { router as v1Router };
