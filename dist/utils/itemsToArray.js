"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsToArray = void 0;
const itemsToArray = (task) => {
    const arr = task.list.map(item => item.text);
    return Object.assign(Object.assign({}, task), { list: arr });
};
exports.itemsToArray = itemsToArray;
//# sourceMappingURL=itemsToArray.js.map