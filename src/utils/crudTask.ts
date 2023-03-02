import { Task } from '@prisma/client';
import { prisma } from '../index';
import { Task_, TPropsAddNewTask, TPropsDelete, TPropsMove } from '../types';
import { sortedArrayFromLinkedList } from './sortedArrayFromLinkedList';

export const addNewTask = async ({ idParent, name }: TPropsAddNewTask) => {
    let column = null;
    try {
        column = await prisma.column.findUnique({
            where: {
                id: idParent
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
                columnId: idParent,
                name,
                prevId: last ? last.id : null
            }
        });
    } catch(err) {
        throw Error("can't create new task");
    }
    return newTask;
};

export const deleteTask = async ({ id, isDelete, tx }: TPropsDelete) => {
    if (!tx) tx = prisma;
    let toDelete, count;
    try {
        toDelete = await tx.task.findUnique({
            where: { id }
        });
    } catch(err) {
        throw new Error("task to delete not exist");
    };
    try {
        count = await tx.task.updateMany({
            where: { prevId: toDelete!.id },
            data: {
                prevId: toDelete!.prevId
            }
        });
    } catch(err) {
        throw Error("can't update next to delete");
    };
    try {
        if (isDelete) {
            toDelete = await tx.task.delete({
                where: { id }
            });
        } 
    } catch(err) {
        throw new Error("can't delete task");
    }
    return toDelete;
};

export const moveTask = async (
    { idParent, idAfter, idToMove }: TPropsMove) => {

    await prisma.$transaction(async (tx) => {
        let toMove;
// remove from old place
        try {
            await deleteTask({ id: idToMove, isDelete: false, tx });
        } catch(err) {
            throw Error("can't remove from old place");
        }
        try {
// update next to insert, may be absent
            const count = await tx.task.updateMany({
                where: {
                    AND: [
                        { columnId: idParent }, // neccessary, if idAfter = null
                        { prevId: idAfter }
                    ] 
                },
                data: {
                    prevId: idToMove
                }    
            }); 
        } catch(err) {
            // if (err instanceof Prisma.PrismaClientKnownRequestError) {
            //     if (err.code != 'P2002') // ignore unique prevId constrain error
                    throw Error('update next to insert error');
            // }
        };      
        try {
            toMove = await tx.task.update({
                where: { id: idToMove },
                data: {
                    columnId: idParent,
                    prevId: idAfter
                }    
            });
        } catch(err) {
            throw Error("can't update moved task");
        }
        return toMove;
    });
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