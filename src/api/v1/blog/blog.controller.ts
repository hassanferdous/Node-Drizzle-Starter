import { Request, Response } from "express";
import { BlogService } from "./blog.service";
import { sendSuccess } from "../../../utils/response";
export const BlogController = {
	getAllBlogs: async (_req: Request, res: Response) => {
		const data = await BlogService.getAllBlogs();
		return sendSuccess(res, data, 200);
	},
};
