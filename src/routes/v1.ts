import { Router } from "express";
import userRoutes from "../api/v1/user/user.route";
import postRoutes from "../api/v1/post/post.route";

const router = Router();

router.use("/users", userRoutes);
router.use("/posts", postRoutes);

console.log("hello");

export { router as v1Router };
