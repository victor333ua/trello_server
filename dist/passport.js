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
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const index_1 = require("./index");
const verify = (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let user;
    try {
        const socialUser = yield index_1.prisma.federatedCredential.findFirst({
            where: { socialId: profile.id, provider: profile.provider },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });
        if (socialUser) {
            done(null, socialUser.user);
        }
        else {
            if (!profile.emails) {
                done(null, false, { message: "user doesn't have email" });
                return;
            }
            const promises = profile.emails.map((email) => __awaiter(void 0, void 0, void 0, function* () {
                return !!(yield index_1.prisma.user.findUnique({
                    where: { email: email.value }
                }));
            }));
            const exists = yield Promise.all(promises);
            const exist = exists.some(bool => bool);
            if (exist)
                done(null, false, { message: 'user with such email already exist' });
            else {
                user = yield index_1.prisma.user.create({
                    data: {
                        email: profile.emails[0].value,
                        name: (_a = profile.name) === null || _a === void 0 ? void 0 : _a.givenName,
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                });
                yield index_1.prisma.federatedCredential.create({
                    data: { userId: user.id, provider: profile.provider, socialId: profile.id }
                });
                done(null, user);
            }
        }
    }
    catch (err) {
        done(err);
    }
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_URI_REDIRECT,
}, (accessToken, refreshToken, profile, done) => {
    (() => __awaiter(void 0, void 0, void 0, function* () { return yield verify(accessToken, refreshToken, profile, done); }))();
}));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_URI_REDIRECT
}, (accessToken, refreshToken, profile, done) => {
    (() => __awaiter(void 0, void 0, void 0, function* () { return yield verify(accessToken, refreshToken, profile, done); }))();
}));
//# sourceMappingURL=passport.js.map