import { Item, Task } from "@prisma/client";

export type Task_ = {
    id: string,
    name: string,
    columnId: string,
    list: string[],
    text: string | null
};
export type TPropsMove = {
    idAfter: string,
    idToMove: string,
    idParent: string,
};
export type TPropsDelete = {
    id: string,
    isDelete: boolean,
    tx: any
};
export type TPropsAddNewTask = {
    idParent: string,
    name: string
};
export type TTaskItems = Task & { list: Item[] };

export type TPropsAddNewColumn = {
    idParent: string,
    name: string
};
export type TPropsUpdateColumn = {
    id: string,
    name: string
};

