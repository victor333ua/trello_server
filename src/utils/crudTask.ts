import { Task } from '@prisma/client';
import { prisma } from '../index';
import { Task_, TPropsAddNewTask } from '../types';
import { findLastElement } from './crudLinkedList';

export const addNewTask = async ({ idParent, name }: TPropsAddNewTask) => {
    const last = await findLastElement<Task>({
            parentModel: 'column', 
            childListName: 'tasks',
            idParent
    });
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