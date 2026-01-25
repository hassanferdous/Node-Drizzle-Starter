import { Request } from "express";
import { Role, User } from "../domains/v1/user/service";
import { AbilityTuple, MongoQuery } from "@casl/ability";
export type Permssion = {
	resource: string;
	action: string;
	description: string | null;
};
export type AuthSession = {
	csrf: string;
	permissions: Permssion[];
	roles: Role[];
	user: AuthUser;
};

export type CaslAbility = MongoAbility<AbilityTuple, MongoQuery>;

export type AuthTokenPayload = {
	user: AuthUser;
};

export type AuthUser = User & {
	permissions: Permssion[];
	roles: Role[];
	sid: string;
};

export type AuthorizedRequest = Request & {
	ability: CaslAbility;
};
