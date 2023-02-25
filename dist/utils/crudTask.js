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
exports.updateTask = exports.moveTask = exports.deleteTask = exports.addNewTask = void 0;
const client_1 = require("@prisma/client");
const sortedArrayFromLinkedList_1 = require("./sortedArrayFromLinkedList");
const prisma = new client_1.PrismaClient();
const addNewTask = ({ columnId, name }) => __awaiter(void 0, void 0, void 0, function* () {
    let column = null;
    try {
        column = yield prisma.column.findUnique({
            where: {
                id: columnId
            },
            include: { tasks: true }
        });
    }
    catch (err) {
        throw Error("illegal columnId");
    }
    let last = null;
    if (column.tasks && column.tasks.length != 0) {
        const sorted = (0, sortedArrayFromLinkedList_1.sortedArrayFromLinkedList)(column.tasks);
        last = sorted[sorted.length - 1];
    }
    ;
    let newTask;
    try {
        newTask = yield prisma.task.create({
            data: {
                columnId,
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
const deleteTask = ({ id, isDelete }) => __awaiter(void 0, void 0, void 0, function* () {
    let toDelete;
    try {
        toDelete = yield prisma.task.findUnique({
            where: { id }
        });
    }
    catch (err) {
        throw new Error("task to delete not exist");
    }
    ;
    try {
        const nextToDelete = yield prisma.task.update({
            where: { prevId: toDelete.id },
            data: {
                prevId: toDelete.prevId
            }
        });
    }
    catch (err) { }
    ;
    try {
        if (isDelete) {
            toDelete = yield prisma.task.delete({
                where: { id }
            });
        }
    }
    catch (err) {
        throw new Error("can't delete task");
    }
    return toDelete.id;
});
exports.deleteTask = deleteTask;
const moveTask = ({ idColumn: columnId, idAfterTask, idToMove, isFirst }) => __awaiter(void 0, void 0, void 0, function* () {
    let toMove;
    if (isFirst) {
        try {
            yield prisma.task.updateMany({
                where: {
                    AND: [
                        { columnId },
                        { prevId: null }
                    ]
                },
                data: {
                    prevId: idToMove
                }
            });
        }
        catch (err) { }
        ;
        try {
            toMove = yield prisma.task.update({
                where: { id: idToMove },
                data: {
                    columnId,
                    prevId: null
                }
            });
        }
        catch (err) {
            throw Error("can't move task to 1st place in new column");
        }
    }
    else {
        const idToRemove = yield (0, exports.deleteTask)({ id: idToMove, isDelete: false });
        try {
            const nextToInsert = yield prisma.task.update({
                where: {
                    prevId: idAfterTask
                },
                data: {
                    prevId: idToMove
                }
            });
        }
        catch (err) { }
        ;
        toMove = yield prisma.task.update({
            where: {
                id: idToMove
            },
            data: {
                prevId: idAfterTask,
                columnId
            }
        });
    }
    return toMove;
});
exports.moveTask = moveTask;
const updateTask = (task) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, text, list } = task;
    const upd = yield prisma.task.update({
        where: { id },
        data: {
            name, text
        }
    });
    const deleteItems = yield prisma.item.deleteMany({
        where: { taskId: id }
    });
    const addItems = yield Promise.all(list.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.item.create({
            data: {
                text: item,
                taskId: id
            }
        });
    })));
    return prisma.task.findUnique({
        where: { id },
        include: { list: true }
    });
});
exports.updateTask = updateTask;
//# sourceMappingURL=crudTask.js.map