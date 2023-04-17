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
const index_1 = require("../index");
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../constants");
const authRouter = express_1.default.Router();
const cookieAttr = {
    httpOnly: constants_1.__prod__,
    sameSite: constants_1.__prod__ ? 'none' : 'lax',
    secure: constants_1.__prod__,
    maxAge: 1000 * 60 * 60 * 24 * 365,
};
authRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        let user = yield index_1.prisma.user.findUnique({
            where: { email }
        });
        if (user)
            throw new Error(JSON.stringify({ email: 'user already exist!!!' }));
        const cryptPassword = yield bcrypt_1.default.hash(password, 10);
        user = yield index_1.prisma.user.create({
            data: { email, password: cryptPassword }
        });
        res.cookie(constants_1.COOKIE_NAME, `${user.id}`, cookieAttr).json({ user });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}));
authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield index_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user)
            throw new Error(JSON.stringify({ email: 'no such user!' }));
        if (!user.password)
            throw new Error(JSON.stringify({ email: 'this user was authorized through social media !' }));
        const isCompare = yield bcrypt_1.default.compare(password, user.password);
        if (!isCompare)
            throw new Error(JSON.stringify({ password: 'invalid password' }));
        res.cookie(constants_1.COOKIE_NAME, `${user.id}`, cookieAttr).json({ user });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}));
authRouter.get('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie(constants_1.COOKIE_NAME);
}));
exports.default = authRouter;
//# sourceMappingURL=authRoute.js.map