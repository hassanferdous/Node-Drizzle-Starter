import { Request } from "express";
import { Role, User } from "../domains/v1/user/service";
import { AbilityTuple, MongoQuery, RawRuleOf } from "@casl/ability";
import { AppAbility } from "@/abilities/app.ability";

export type AuthSession = {
	csrf: string;
	permissions: RawRuleOf<AppAbility>[];
	roles: Role[];
	user: AuthUser;
};

export type AuthUser = User & {
	permissions: RawRuleOf<AppAbility>[];
	roles: Role[];
	sid: string;
};

export type CaslAbility = MongoAbility<AbilityTuple, MongoQuery>;

export type AuthTokenPayload = {
	user: AuthUser;
};
