import { Router } from "express";
import { PostController } from "./post.controller";

const router = Router();

router.get("/", PostController.getPosts);

export default router;
