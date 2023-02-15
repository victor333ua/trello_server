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
const index_1 = require("./index");
const router = express_1.default.Router();
router.get('/feed/:groupId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId } = req.params;
    try {
        const columns = yield index_1.prisma.column.findMany({
            where: { groupId: Number(groupId) },
            orderBy: { index: 'asc' },
            include: {
                tasks: {
                    orderBy: { index: 'asc' },
                    include: {
                        list: true
                    }
                }
            }
        });
        res.json({ columns });
    }
    catch (error) {
        console.log('err=', error);
        res.status(500).send(error);
    }
}));
exports.default = router;
//# sourceMappingURL=routes.js.map