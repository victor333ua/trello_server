export type LinkedList = {
    id: string,
    prevId: string | null
}

export const sortedArrayFromLinkedList = <T extends LinkedList>(taskList: T[]) => {
    const taskArray = Array<T>();
    const indexedIds = new Map<string, number>();
    let currentId = null, currentTask: T;

    taskList.forEach((task, i) => {
        if (task.prevId === null) {
            taskArray.push(task);
            currentId = task.id;
        }
        else indexedIds.set(task.prevId, i);  
    });

    if (!currentId) throw Error("no 1st element in the list");

    while (taskArray.length != taskList.length) {
        currentTask = taskList[indexedIds.get(currentId)!];
        taskArray.push(currentTask);
        currentId = currentTask.id;
    };

    return taskArray;
}