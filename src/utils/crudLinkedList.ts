import { Prisma } from '@prisma/client';
import { TPropsDelete, TPropsMove } from '../types';
import { prisma } from '../index';

type TModelName = Uncapitalize<Prisma.ModelName>;
// tableName.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const deleteItem = async ({ id, isDelete, tx }: TPropsDelete, model: TModelName) => {
    if (!tx) tx = prisma;
    let toDelete, count;
    try {
        toDelete = await tx[model].findUnique({
            where: { id }
        });
    } catch(err) {
        throw new Error("item to delete not exist");
    };
    try {
        count = await tx[model].updateMany({
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
            toDelete = await tx[model].delete({
                where: { id }
            });
        } 
    } catch(err) {
        throw new Error("can't delete");
    }
    return toDelete;
};

export const moveItem = async (
    { idParent, idAfter, idToMove }: TPropsMove, model: TModelName) => {

    await prisma.$transaction(async (tx) => {
        let toMove;
// remove from old place
        try {
            await deleteItem({ id: idToMove, isDelete: false, tx }, model);
        } catch(err) {
            throw Error("can't remove from old place");
        }
        try {
// update next to insert, may be absent
// @ts-ignore
            const count = await tx[model].updateMany({
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
// @ts-ignore
            toMove = await tx[model].update({
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
