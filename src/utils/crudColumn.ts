import { Column } from '@prisma/client';
import { TPropsAddNewColumn, TPropsUpdateColumn, TPropsDelete, TPropsMove } from '../types';
import { prisma } from '../index';
import { findLastElement } from './crudLinkedList';

export const addNewColumn = async ({ idParent, name }: TPropsAddNewColumn) => {
    const last = await findLastElement<Column>({
        parentModel: 'group', 
        childListName: 'columns',
        idParent
    });
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


