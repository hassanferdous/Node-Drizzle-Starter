import { Request, Response } from "express";
import { sendSuccess } from "@utils/response";
import { PostService } from "./post.service";

export const PostController = {
	getPosts: async (_req: Request, res: Response) => {
		const posts = await PostService.getPosts();
		return sendSuccess(res, posts, 200);
	},
};
