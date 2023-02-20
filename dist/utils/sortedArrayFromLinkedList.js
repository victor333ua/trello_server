"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortedArrayFromLinkedList = void 0;
const sortedArrayFromLinkedList = (taskList) => {
    const taskArray = Array();
    const indexedIds = new Map();
    let currentId = null, currentTask;
    taskList.forEach((task, i) => {
        if (task.prevId === null) {
            taskArray.push(task);
            currentId = task.id;
        }
        else
            indexedIds.set(task.prevId, i);
    });
    if (!currentId)
        return;
    while (taskArray.length != taskList.length) {
        currentTask = taskList[indexedIds.get(currentId)];
        taskArray.unshift(currentTask);
        currentId = currentTask.id;
    }
    ;
    return taskArray;
};
exports.sortedArrayFromLinkedList = sortedArrayFromLinkedList;
//# sourceMappingURL=sortedArrayFromLinkedList.js.map