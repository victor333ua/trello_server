import { PrismaClient, Task } from '@prisma/client';
import { Task_, TPropsAddNewTask, TPropsDeleteTask, TPropsMoveTask } from '../types';
import { sortedArrayFromLinkedList } from './sortedArrayFromLinkedList';
const prisma = new PrismaClient();

export const addNewTask = async ({ columnId, name }: TPropsAddNewTask) => {
    let column = null;
    try {
        column = await prisma.column.findUnique({
            where: {
                id: columnId
            },
            include: { tasks: true }
        });
    } catch(err) {
        throw Error("illegal columnId");
    }
    let last = null;
    if (column!.tasks && column!.tasks.length != 0) {
        const sorted =  sortedArrayFromLinkedList<Task>(column!.tasks);
        last = sorted[sorted.length - 1];
    };
    let newTask;
    try {
        newTask = await prisma.task.create({
            data: {
                columnId,
                name,
                prevId: last ? last.id : null
            }
        });
    } catch(err) {
        throw Error("can't create new task");
    }
    return newTask;
};

export const deleteTask = async ({ id, isDelete }: TPropsDeleteTask) => {
    let toDelete;
    try {
        toDelete = await prisma.task.findUnique({
            where: { id }
        });
    } catch(err) {
        throw new Error("task to delete not exist");
    };
    try {
        const nextToDelete = await prisma.task.update({
            where: { prevId: toDelete!.id },
            data: {
                prevId: toDelete!.prevId
            }
        });
    } catch(err) {};
    try {
        if (isDelete) {
            toDelete = await prisma.task.delete({
                where: { id }
            });
        }
    } catch(err) {
        throw new Error("can't delete task");
    }
    return toDelete!.id;
};

export const moveTask = async (
    {  idColumn: columnId, idAfterTask, idToMove, isFirst }: TPropsMoveTask) => {
    let toMove;
    // if we move to the start of column
    if (isFirst) {
        try {
            await prisma.task.updateMany({
                where: {
                    AND: [
                        { columnId },
                        { prevId: null }
                    ] 
                },
                data: {
                    prevId: idToMove
                }    
            }); 
        } catch(err) {};      
        try {
            toMove = await prisma.task.update({
                where: { id: idToMove },
                data: {
                    columnId,
                    prevId: null
                }    
            });
        } catch(err) {
            throw Error("can't move task to 1st place in new column");
        }
    } else {
        const idToRemove = await deleteTask({ id: idToMove, isDelete: false });
        try {
            const nextToInsert = await prisma.task.update({
                where: {
                    prevId: idAfterTask
                },
                data: {
                    prevId: idToMove
                }
            });
        } catch(err) {};

        toMove = await prisma.task.update({
            where: {
                id: idToMove
            },
            data: {
                prevId: idAfterTask,
                columnId
            }
        });
    }
    return toMove;
};
export const updateTask = async (task: Task_) => {
    const { id, name, text, list } = task;
    const upd = await prisma.task.update({
        where: { id },
        data: {
            name, text
        }
    });
    const deleteItems = await prisma.item.deleteMany({
        where: { taskId: id }
    });
    const addItems = await Promise.all(list.map(async (item) => {
        await prisma.item.create({
            data: {
                text: item,
                taskId: id
            }
        });
    }));
    return prisma.task.findUnique({
        where: { id },
        include: { list: true }
    });
};