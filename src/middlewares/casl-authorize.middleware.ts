import { createSession } from "@/domains/v1/auth/service";
import { Role, User } from "@/domains/v1/user/service";
import { defineUserAbility } from "@/abilities/user.ability";
import { throwError } from "@/utils/error";
import getCachedOrLoad from "@/utils/getCachedOrLoad";
import { NextFunction, Request, Response } from "express";
import { AbilityTuple, MongoAbility, MongoQuery } from "@casl/ability";
import { AuthUser } from "../types";
export type CaslAbility = MongoAbility<AbilityTuple, MongoQuery>;

export async function caslAuthorize(
	req: Request & { ability?: CaslAbility },
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
