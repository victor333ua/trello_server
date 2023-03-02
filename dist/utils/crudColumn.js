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
exports.updateColumn = exports.moveColumn = exports.deleteColumn = exports.addNewColumn = void 0;
const index_1 = require("../index");
const sortedArrayFromLinkedList_1 = require("./sortedArrayFromLinkedList");
const addNewColumn = ({ idParent, name }) => __awaiter(void 0, void 0, void 0, function* () {
    let group = null;
    try {
        group = yield index_1.prisma.group.findUnique({
            where: {
                id: idParent
            },
            include: { columns: true }
        });
    }
    catch (err) {
        throw Error("illegal groupId");
    }
    let last = null;
    const columns = group.columns;
    if (columns && columns.length != 0) {
        const sorted = (0, sortedArrayFromLinkedList_1.sortedArrayFromLinkedList)(columns);
        last = sorted[sorted.length - 1];
    }
    let newColumn;
    try {
        newColumn = yield index_1.prisma.column.create({
            data: {
                groupId: idParent,
                name,
                prevId: last ? last.id : null
            }
        });
    }
    catch (err) {
        throw Error("can't create new column");
    }
    return newColumn;
});
exports.addNewColumn = addNewColumn;
const deleteColumn = ({ id, isDelete, tx }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!tx)
        tx = index_1.prisma;
    let toDelete, count;
    try {
        toDelete = yield tx.column.findUnique({
            where: { id }
        });
    }
    catch (err) {
        throw new Error("item to delete not exist");
    }
    ;
    try {
        count = yield tx.column.updateMany({
            where: { prevId: toDelete.id },
            data: {
                prevId: toDelete.prevId
            }
        });
    }
    catch (err) {
        throw Error("can't update next to delete");
    }
    ;
    try {
        if (isDelete) {
            toDelete = yield tx.column.delete({
                where: { id }
            });
        }
    }
    catch (err) {
        throw new Error("can't delete");
    }
    return toDelete;
});
exports.deleteColumn = deleteColumn;
const moveColumn = ({ idParent, idAfter, idToMove }) => __awaiter(void 0, void 0, void 0, function* () {
    yield index_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        let toMove;
        try {
            yield (0, exports.deleteColumn)({ id: idToMove, isDelete: false, tx });
        }
        catch (err) {
            throw Error("can't remove from old place");
        }
        try {
            const count = yield tx.column.updateMany({
                where: {
                    AND: [
                        { groupId: idParent },
                        { prevId: idAfter }
                    ]
                },
                data: {
                    prevId: idToMove
                }
            });
        }
        catch (err) {
            throw Error('update next to insert error');
        }
        ;
        try {
            toMove = yield tx.column.update({
                where: { id: idToMove },
                data: {
                    groupId: idParent,
                    prevId: idAfter
                }
            });
        }
        catch (err) {
            throw Error("can't update moved task");
        }
        return toMove;
    }));
});
exports.moveColumn = moveColumn;
const updateColumn = ({ id, name }) => __awaiter(void 0, void 0, void 0, function* () {
    let upd;
    try {
        upd = yield index_1.prisma.column.update({
            where: { id },
            data: {
                name
            }
        });
    }
    catch (err) {
        throw Error("can't update column");
    }
    return upd;
});
exports.updateColumn = updateColumn;
//# sourceMappingURL=crudColumn.js.map