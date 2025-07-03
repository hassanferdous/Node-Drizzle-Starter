import { Request, Response } from "express";
import { sendSuccess } from "@utils/response";
import { UserService } from "./user.service";

export const UserController = {
	getUsers: async (_req: Request, res: Response) => {
		const users = await UserService.getUsers();
		return sendSuccess(res, users, 200);
	},
	createUsers: async (req: Request, res: Response) => {
		const { name, email } = req.body;
		const newUser = await UserService.createUser({ name, email });
		res.status(201).json({ data: newUser });
	},
};
