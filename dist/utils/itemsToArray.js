"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsToArray = void 0;
const itemsToArray = (task) => {
    const arr = task.list.map(item => item.text);
    const { id, name, columnId, text } = task;
    return { id, name, columnId, text, list: arr };
};
exports.itemsToArray = itemsToArray;
//# sourceMappingURL=itemsToArray.js.map