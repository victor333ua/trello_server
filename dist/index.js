"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const route_1 = __importDefault(require("./routes/route"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const oauth2Route_1 = __importDefault(require("./routes/oauth2Route"));
const passport_1 = __importDefault(require("passport"));
require("./passport");
const constants_1 = require("./constants");
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    name: constants_1.COOKIE_NAME,
    secret: constants_1.secret_session,
    saveUninitialized: false,
    resave: false,
    cookie: constants_1.cookieAttr
}));
const corsOptions = {
    origin: [
        process.env.CORS_ORIGIN,
    ],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(passport_1.default.initialize());
app.use('/', route_1.default);
app.use('/auth', authRoute_1.default);
app.use('/', oauth2Route_1.default);
const port = 4000;
const server = app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
//# sourceMappingURL=index.js.map