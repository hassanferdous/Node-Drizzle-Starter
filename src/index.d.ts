import { User } from "./domains/v1/user/service";

export type Session = {
	csrf: string;
	permissions: string;
	userId: number;
};

export type AuthTokenPayload = {
	user: User;
	sid: string;
};
