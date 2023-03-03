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
exports.updateColumn = exports.addNewColumn = void 0;
const index_1 = require("../index");
const crudLinkedList_1 = require("./crudLinkedList");
const addNewColumn = ({ idParent, name }) => __awaiter(void 0, void 0, void 0, function* () {
    const last = yield (0, crudLinkedList_1.findLastElement)({
        parentModel: 'group',
        childListName: 'columns',
        idParent
    });
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