import { CookieOptions } from "express";

export const __prod__ = process.env.NODE_ENV === 'production';
export const COOKIE_NAME = "Login";
export const cookieAttr: CookieOptions = {
    httpOnly: __prod__,  
    sameSite: __prod__ ? 'none' : 'lax',  
    secure: __prod__,
    maxAge: 1000 * 60 * 60 * 24 * 365,
};
export const secret_session = 'qwerty_vic3'
