import { Column } from '@prisma/client';
import { TPropsAddNewColumn, TPropsUpdateColumn, TPropsDelete, TPropsMove } from '../types';
import { prisma } from '../index';
import { sortedArrayFromLinkedList } from './sortedArrayFromLinkedList';

export const addNewColumn = async ({ idParent, name }: TPropsAddNewColumn) => {
    let group = null;
    try {
        group = await prisma.group.findUnique({
            where: {
                id: idParent
            },
            include: { columns: true }
        });
    } catch(err) {
        throw Error("illegal groupId");
    }
    let last = null;
    const columns = group!.columns;
    if ( columns && columns.length != 0) {
        const sorted =  sortedArrayFromLinkedList<Column>(columns);
        last = sorted[sorted.length - 1];
    }
    let newColumn;
    try {
        newColumn = await prisma.column.create({
            data: {
                groupId: idParent,
                name,
                prevId: last ? last.id : null
            }
        });
    } catch(err) {
        throw Error("can't create new column");
    }
    return newColumn;
};
export const deleteColumn = async ({ id, isDelete, tx }: TPropsDelete) => {
    if (!tx) tx = prisma;
    let toDelete, nextToDelete;
    try {
        toDelete = await tx.column.findUnique({
            where: { id }
        });
    } catch(err) {
        console.log(err);
        throw new Error("item to delete not exist");
    };
    try {
        nextToDelete = await tx.column.updateMany({
            where: { prevId: toDelete!.id },
            data: {
                prevId: toDelete!.prevId
            }
        });
    } catch(err) {
        console.log(err);
        throw Error("can't update next to delete");
    };
    try {
        if (isDelete) {
            toDelete = await tx.column.delete({
                where: { id }
            });
        } 
    } catch(err) {
        throw new Error("can't delete");
    }
    return toDelete;
};

export const moveColumn = async (
    { idParent, idAfter, idToMove }: TPropsMove) => {

    await prisma.$transaction(async (tx) => {
        let toMove;
// remove from old place
        try {
            await deleteColumn({ id: idToMove, isDelete: false, tx });
        } catch(err) {
            throw Error("can't remove from old place");
        }
        try {
// update next to insert, may be absent
            const count = await tx.column.updateMany({
                where: {
                    AND: [
                        { groupId: idParent }, // neccessary, if idAfter = null
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
            toMove = await tx.column.update({
                where: { id: idToMove },
                data: {
                    groupId: idParent,
                    prevId: idAfter
                }    
            });
        } catch(err) {
            throw Error("can't update moved task");
        }
        return toMove;
    });
};

export const updateColumn = async ({ id, name }: TPropsUpdateColumn) => {
    let upd: Column;
    try {
        upd = await prisma.column.update({
            where: { id },
            data: {
                name
            }
        });
    } catch(err) {
        throw Error("can't update column");
    }
    return upd;
};


