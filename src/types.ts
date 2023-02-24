import { Item, Task } from "@prisma/client";

export type Task_ = {
    id: string,
    name: string,
    list: string[],
    text: string | null
};
export type TPropsMoveTask = {
    idAfterTask: string,
    idToMove: string,
    idColumn: string,
    isFirst: boolean
};
export type TPropsDeleteTask = {
    id: string,
    isDelete: boolean
};
export type TPropsAddNewTask = {
    columnId: string,
    name: string
};

export type TTaskItems = Task & { list: Item[] };
