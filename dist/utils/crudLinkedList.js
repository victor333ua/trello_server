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
exports.findLastElement = exports.moveItem = exports.deleteItem = void 0;
const index_1 = require("../index");
const sortedArrayFromLinkedList_1 = require("./sortedArrayFromLinkedList");
const deleteItem = ({ id, isDelete, tx }, model) => __awaiter(void 0, void 0, void 0, function* () {
    if (!tx)
        tx = index_1.prisma;
    let toDelete, count;
    try {
        toDelete = yield tx[model].findUnique({
            where: { id }
        });
    }
    catch (err) {
        throw new Error("item to delete not exist");
    }
    ;
    try {
        count = yield tx[model].updateMany({
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
            toDelete = yield tx[model].delete({
                where: { id }
            });
        }
    }
    catch (err) {
        throw new Error("can't delete");
    }
    return toDelete;
});
exports.deleteItem = deleteItem;
const moveItem = ({ idParent, idAfter, idToMove }, model) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, parentIdName } = model;
    yield index_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        let toMove;
        try {
            yield (0, exports.deleteItem)({ id: idToMove, isDelete: false, tx }, name);
        }
        catch (err) {
            throw Error("can't remove from old place");
        }
        try {
            const count = yield tx[model.name].updateMany({
                where: {
                    AND: [
                        { [parentIdName]: idParent },
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
            toMove = yield tx[name].update({
                where: { id: idToMove },
                data: {
                    [parentIdName]: idParent,
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
exports.moveItem = moveItem;
const findLastElement = (arg) => __awaiter(void 0, void 0, void 0, function* () {
    let parent = null;
    try {
        parent = yield index_1.prisma[arg.parentModel].findUnique({
            where: {
                id: arg.idParent
            },
            include: { [arg.childListName]: true }
        });
    }
    catch (err) {
        throw Error("findLastElement: can't find parent");
    }
    let last = null;
    const list = parent[arg.childListName];
    if (list && list.length != 0) {
        const sorted = (0, sortedArrayFromLinkedList_1.sortedArrayFromLinkedList)(list);
        last = sorted[sorted.length - 1];
    }
    ;
    return last;
});
exports.findLastElement = findLastElement;
//# sourceMappingURL=crudLinkedList.js.map