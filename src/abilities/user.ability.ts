import { AuthSession } from "../types";
import { createAbility } from "./app.ability";

export function defineUserAbility(session: AuthSession) {
	const userAbility = createAbility(session.permissions);
	return userAbility;
}
