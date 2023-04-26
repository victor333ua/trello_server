"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const constants_1 = require("../constants");
const router = express_1.default.Router();
const cb = (res, err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
    if (user) {
        res.cookie(constants_1.COOKIE_NAME, `${user.id}`, constants_1.cookieAttr);
        res.redirect(`${process.env.CORS_ORIGIN}/`);
        return;
    }
    let errorMessage = err
        ? err.message
        : info === null || info === void 0 ? void 0 : info.message;
    res.redirect(`${process.env.CORS_ORIGIN}/oauth2Error` +
        `?error=${errorMessage}`);
});
router.get('/oauth2/google/login', passport_1.default.authenticate('google', {
    scope: ['email', 'profile'],
    session: false
}));
router.get(process.env.GOOGLE_URI_REDIRECT, (req, res, next) => {
    passport_1.default.authenticate('google', {
        session: false
    }, (err, user, info) => {
        (() => __awaiter(void 0, void 0, void 0, function* () { return yield cb(res, err, user, info); }))();
    })(req, res, next);
});
router.get('/oauth2/github/login', passport_1.default.authenticate('github', {
    scope: ['user:email', 'read:user'],
    session: false
}));
router.get(process.env.GITHUB_URI_REDIRECT, (req, res, next) => {
    passport_1.default.authenticate('github', {
        session: false
    }, (err, user, info) => {
        (() => __awaiter(void 0, void 0, void 0, function* () { return yield cb(res, err, user, info); }))();
    })(req, res, next);
});
exports.default = router;
//# sourceMappingURL=oauth2Route.js.map