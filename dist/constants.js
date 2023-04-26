"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieAttr = exports.COOKIE_NAME = exports.__prod__ = void 0;
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.COOKIE_NAME = "Login";
exports.cookieAttr = {
    httpOnly: exports.__prod__,
    sameSite: exports.__prod__ ? 'none' : 'lax',
    secure: exports.__prod__,
    maxAge: 1000 * 60 * 60 * 24 * 365,
};
//# sourceMappingURL=constants.js.map