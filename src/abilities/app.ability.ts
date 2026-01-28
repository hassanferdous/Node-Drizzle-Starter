import {
	createMongoAbility,
	MongoAbility,
	RawRuleOf,
	ForcedSubject
} from "@casl/ability";

export const actions = [
	"manage",
	"create",
	"read",
	"update",
	"delete",
	"list"
] as const;
export const subjects = ["User", "Role", "Permission", "all"] as const;

export type Abilities = [
	(typeof actions)[number],
	(
		| (typeof subjects)[number]
		| (ForcedSubject<Exclude<(typeof subjects)[number], "all">> & {
				subjectType: (typeof subjects)[number];
		  })
	)
];
export type AppAbility = MongoAbility<Abilities>;
export const createAbility = (rules: RawRuleOf<AppAbility>[]) =>
	createMongoAbility<AppAbility>(rules, {
		detectSubjectType: (subject) => subject.subjectType
	});
