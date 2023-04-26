import { Task_, TTaskItems } from "../types";

export const itemsToArray = (task: TTaskItems): Task_ => {
    const arr = task.list.map(item  => item.text);
    const { id, name, columnId, text } = task;
    return { id, name, columnId, text, list: arr };   
};