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
const crudTask_1 = require("./utils/crudTask");
const itemsToArray_1 = require("./utils/itemsToArray");
const sortedArrayFromLinkedList_1 = require("./utils/sortedArrayFromLinkedList");
const router = express_1.default.Router();
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
        let tasks_;
        const output = columns.map(column => {
            tasks_ = [];
            if (column.tasks && column.tasks.length != 0) {
                const sorted = (0, sortedArrayFromLinkedList_1.sortedArrayFromLinkedList)(column.tasks);
                tasks_ = sorted.map(task => (0, itemsToArray_1.itemsToArray)(task));
            }
            return (Object.assign(Object.assign({}, column), { tasks: tasks_ }));
        });
        res.json({ columns: output });
    }
    catch (error) {
        console.log('err=', error);
        res.status(500).send(error);
    }
}));
router.post('/addTask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { columnId, name } = req.body;
    if (!columnId || !name)
        res.sendStatus(500);
    try {
        const newTask = yield (0, crudTask_1.addNewTask)({ columnId, name });
        res.json({ id: newTask.id });
    }
    catch (err) {
        res.sendStatus(500);
    }
}));
router.post('/updateTask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = req.body;
    const updatedTask = yield (0, crudTask_1.updateTask)(task);
    if (updatedTask) {
        res.sendStatus(400);
    }
    else {
        res.sendStatus(500);
    }
}));
router.post('/moveTask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const movedTask = yield (0, crudTask_1.moveTask)(data);
    if (movedTask) {
        res.sendStatus(400);
    }
    else {
        res.sendStatus(500);
    }
}));
router.delete('/deleteTask/:idTask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idTask } = req.params;
    const id = yield (0, crudTask_1.deleteTask)({ id: idTask, isDelete: true });
    if (id) {
        res.sendStatus(400);
    }
    else {
        res.sendStatus(500);
    }
}));
exports.default = router;
//# sourceMappingURL=routes.js.map