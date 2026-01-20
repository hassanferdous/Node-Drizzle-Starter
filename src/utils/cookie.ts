import { config } from "@/config";
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
		domain: options.domain
	});
}

export interface TokenOptions {
	access_token?: string;
	refresh_token?: string;
	csrf?: string;
}

const baseOptions = {
	path: "/",
	sameSite: "lax" as const,
	secure: config.app.env === "production"
};
export function setAuthCookies(res: Response, tokens: TokenOptions): void {
	if (tokens.access_token) {
		setCookie(res, "access_token", tokens.access_token, {
			...baseOptions,
			httpOnly: true,
			maxAge: 60 * 10 * 1000 // 10min
		});
	}
	if (tokens.csrf) {
		setCookie(res, "csrf", tokens.csrf, {
			...baseOptions,
			httpOnly: false,
			maxAge: 60 * 10 * 1000 // 10min
		});
	}

	if (tokens.refresh_token) {
		setCookie(res, "refresh_token", tokens.refresh_token, {
			...baseOptions,
			httpOnly: true,
			maxAge: 60 * 60 * 1000 * 24 // 1day
		});
	}
}

export function clearAuthCookies(res: Response): void {
	res.clearCookie("access_token", {
		...baseOptions,
		httpOnly: true
	});

	res.clearCookie("refresh_token", {
		...baseOptions,
		httpOnly: true
	});

	res.clearCookie("csrf", {
		...baseOptions,
		httpOnly: false
	});
}
