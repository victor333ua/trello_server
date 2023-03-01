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
const crudColumn_1 = require("./utils/crudColumn");
const crudTask_1 = require("./utils/crudTask");
const itemsToArray_1 = require("./utils/itemsToArray");
const sortedArrayFromLinkedList_1 = require("./utils/sortedArrayFromLinkedList");
const router = express_1.default.Router();
router.get('/groups', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let groups;
    try {
        groups = yield index_1.prisma.group.findMany();
        res.json(groups);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.get('/feed/:groupId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupId } = req.params;
    try {
        let columns = yield index_1.prisma.column.findMany({
            where: { groupId },
            include: {
                tasks: {
                    include: {
                        list: true
                    },
                }
            }
        });
        const output = columns.map(column => {
            let tasks_ = Array();
            if (column.tasks && column.tasks.length != 0) {
                const sorted = (0, sortedArrayFromLinkedList_1.sortedArrayFromLinkedList)(column.tasks);
                tasks_ = sorted.map(task => (0, itemsToArray_1.itemsToArray)(task));
            }
            return (Object.assign(Object.assign({}, column), { tasks: tasks_ }));
        });
        res.json({ columns: output });
    }
    catch (err) {
        console.log('err=', err);
        res.status(500).send(err.message);
    }
}));
router.post('/addTask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idParent, name } = req.body;
    if (!idParent || !name)
        res.sendStatus(500);
    try {
        const newTask = yield (0, crudTask_1.addNewTask)({ idParent, name });
        res.json({ id: newTask.id });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.post('/updateTask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = req.body;
    let upd;
    try {
        upd = yield (0, crudTask_1.updateTask)(task);
        res.sendStatus(204);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.post('/moveTask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const movedTask = yield (0, crudTask_1.moveTask)(data);
        res.sendStatus(204);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.delete('/deleteTask/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield (0, crudTask_1.deleteTask)({ id, isDelete: true, tx: null });
        res.sendStatus(204);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.post('/addColumn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idParent, name } = req.body;
    if (!idParent || !name)
        res.sendStatus(500);
    try {
        const newColumn = yield (0, crudColumn_1.addNewColumn)({ idParent, name });
        res.json({ id: newColumn.id });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.post('/updateColumn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name } = req.body;
    let upd;
    try {
        upd = yield (0, crudColumn_1.updateColumn)({ id, name });
        res.sendStatus(204);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.post('/moveColumn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const moved = yield (0, crudColumn_1.moveColumn)(data);
        res.sendStatus(204);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.delete('/deleteColumn/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield (0, crudColumn_1.deleteColumn)({ id, isDelete: true, tx: null });
        res.sendStatus(204);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
exports.default = router;
//# sourceMappingURL=routes.js.map