import { PrismaClient } from '@prisma/client';
import { Task_, TPropsAddNewTask, TPropsDeleteTask, TPropsMoveTask } from '../types';
const prisma = new PrismaClient();

export const addNewTask = async ({ columnId, name }: TPropsAddNewTask) => {
    const firstTask = await prisma.task.findFirst({
        where: { 
            AND: [
                { columnId },
                { prevId: undefined },
            ] 
        }
    });
    const newTask = await prisma.task.create({
        data: {
            columnId,
            name
        }
    });
    if (firstTask) {
        await prisma.task.update({
            where: { id: firstTask.id },
            data: {
                prevId: newTask.id
            }    
        })
    };
    return newTask;
};

export const deleteTask = async ({ id, isDelete }: TPropsDeleteTask) => {
    let toDelete = await prisma.task.findUnique({
        where: { id }
    });
    const nextToDelete = await prisma.task.update({
        where: { prevId: toDelete!.id },
        data: {
            prevId: toDelete!.prevId
        }
    });
    if (isDelete) {
        toDelete = await prisma.task.delete({
            where: { id }
        });
    }
    return toDelete!.id;
};

export const moveTask = async ({ idAfterTaskOrColumn, idToMove, isFirst }: TPropsMoveTask) => {
    let toMove;
    // if we move to the start of column
    if (isFirst) {
        const firstTask = await prisma.task.findFirst({
            where: { 
                AND: [
                    { columnId: idAfterTaskOrColumn },
                    { prevId: undefined },
                ] 
            }
        });
        if (firstTask) {
            await prisma.task.update({
                where: { id: firstTask.id },
                data: {
                    prevId: idToMove
                }    
            });
        };
        toMove = await prisma.task.update({
            where: { id: idToMove },
            data: {
                columnId: idAfterTaskOrColumn,
                prevId: undefined
            }    
        });
    } else {
        const nextToInsert = await prisma.task.update({
            where: {
                prevId: idAfterTaskOrColumn
            },
            data: {
                prevId: idToMove
            }
        });
        toMove = await prisma.task.update({
            where: {
                id: idToMove
            },
            data: {
                prevId: idAfterTaskOrColumn,
                columnId: nextToInsert.columnId
            }
        });
        const idToRemove = await deleteTask({ id: idToMove, isDelete: false });
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