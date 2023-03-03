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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTask = exports.addNewTask = void 0;
const index_1 = require("../index");
const crudLinkedList_1 = require("./crudLinkedList");
const addNewTask = ({ idParent, name }) => __awaiter(void 0, void 0, void 0, function* () {
    const last = yield (0, crudLinkedList_1.findLastElement)({
        parentModel: 'column',
        childListName: 'tasks',
        idParent
    });
    let newTask;
    try {
        newTask = yield index_1.prisma.task.create({
            data: {
                columnId: idParent,
                name,
                prevId: last ? last.id : null
            }
        });
    }
    catch (err) {
        throw Error("can't create new task");
    }
    return newTask;
});
exports.addNewTask = addNewTask;
const updateTask = (task) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, text, list } = task;
    const upd = yield index_1.prisma.task.update({
        where: { id },
        data: {
            name, text
        }
    });
    const deleteItems = yield index_1.prisma.item.deleteMany({
        where: { taskId: id }
    });
    const addItems = yield Promise.all(list.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        yield index_1.prisma.item.create({
            data: {
                text: item,
                taskId: id
            }
        });
    })));
    return index_1.prisma.task.findUnique({
        where: { id },
        include: { list: true }
    });
});
exports.updateTask = updateTask;
//# sourceMappingURL=crudTask.js.map