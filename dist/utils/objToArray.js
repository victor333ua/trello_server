"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objToArray = void 0;
const objToArray = (columns) => {
    columns.map(column => {
        column.tasks.map((task) => {
            const arr = task.list.map(item => item.text);
            task.list = arr;
        });
    });
    return columns;
};
exports.objToArray = objToArray;
//# sourceMappingURL=objToArray.js.map