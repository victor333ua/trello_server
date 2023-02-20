import { TTaskItems } from "../types";

export const sortedArrayFromLinkedList = (taskList: TTaskItems[]) => {
    const taskArray = Array<TTaskItems>();
    const indexedIds = new Map<string, number>();
    let currentId = null, currentTask: TTaskItems;

    taskList.forEach((task, i) => {
        if (task.prevId === null) {
            taskArray.push(task);
            currentId = task.id;
        }
        else indexedIds.set(task.prevId, i);  
    });

    if (!currentId) return;

    while (taskArray.length != taskList.length) {
        currentTask = taskList[indexedIds.get(currentId)!];
        taskArray.unshift(currentTask);
        currentId = currentTask.id;
    };

    return taskArray;
}