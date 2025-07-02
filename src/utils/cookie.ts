import { Response } from "express";

interface SetCookieOptions {
	httpOnly?: boolean;
	secure?: boolean;
	maxAge?: number;
	path?: string;
	sameSite?: boolean | "lax" | "strict" | "none";
	domain?: string;
}

export function setCookie(
	res: Response,
	name: string,
	value: string,
	options: SetCookieOptions = {}
): void {
	res.cookie(name, value, {
		httpOnly: options.httpOnly ?? true,
		secure: options.secure ?? false,
		maxAge: options.maxAge,
		path: options.path ?? "/",
		sameSite: options.sameSite ?? "lax",
		domain: options.domain,
	});
}

export interface TokenOptions {
	access_token?: string;
	refresh_token?: string;
	accessTokenOptions?: SetCookieOptions;
	refreshTokenOptions?: SetCookieOptions;
}

export function setAuthCookies(res: Response, tokens: TokenOptions): void {
	if (tokens.access_token) {
		setCookie(res, "access_token", tokens.access_token, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 10, // 10min
			...tokens.accessTokenOptions,
		});
	}

	if (tokens.refresh_token) {
		setCookie(res, "refresh_token", tokens.refresh_token, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24, // 1day
			...tokens.refreshTokenOptions,
		});
	}
}
