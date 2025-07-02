import express from "express";
import { BlogController } from "./blog.controller";

const router = express.Router();

router.get("/", BlogController.getAllBlogs);

export default router;
