import { Task_, TTaskItems } from "../types";

export const itemsToArray = (task: TTaskItems): Task_ => {
    const arr = task.list.map(item  => item.text);
    return { ...task, list: arr };   
};