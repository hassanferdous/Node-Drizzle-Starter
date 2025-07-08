"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = setCookie;
exports.setAuthCookies = setAuthCookies;
function setCookie(res, name, value, options = {}) {
    res.cookie(name, value, {
        httpOnly: options.httpOnly ?? true,
        secure: options.secure ?? false,
        maxAge: options.maxAge,
        path: options.path ?? "/",
        sameSite: options.sameSite ?? "lax",
        domain: options.domain,
    });
}
function setAuthCookies(res, tokens) {
    if (tokens.access_token) {
        setCookie(res, "access_token", tokens.access_token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 10 * 1000, // 10min
        });
    }
    if (tokens.refresh_token) {
        setCookie(res, "refresh_token", tokens.refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 1000 * 24, // 1day
        });
    }
}
