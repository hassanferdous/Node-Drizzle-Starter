import { defineUserAbility } from "@/abilities/user.ability";
import { createSession } from "@/domains/v1/auth/service";
import { throwError } from "@/utils/error";
import getCachedOrLoad from "@/utils/getCachedOrLoad";
import { AbilityTuple, MongoAbility, MongoQuery } from "@casl/ability";
import { NextFunction, Request, Response } from "express";
import { AuthUser } from "../types";
export type CaslAbility = MongoAbility<AbilityTuple, MongoQuery>;

export async function caslAuthorize(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const user = req.user as AuthUser;
	if (!user) throwError("Unauthenticated", 401);

	const session =
		(await getCachedOrLoad(user.sid, () => createSession(user), 60 * 10)) ||
		{};
	req.ability = defineUserAbility({ ...session, user });
	next();
}
