import { Column } from '@prisma/client';
import express from 'express'
import { COOKIE_NAME } from '../constants';
import { prisma } from '../index';
import { Task_, TPropsMove, TTaskItems } from '../types';
import { addNewColumn, updateColumn } from '../utils/crudColumn';
import { deleteItem, moveItem } from '../utils/crudLinkedList';
import { addNewTask, updateTask } from '../utils/crudTask';
import { itemsToArray } from '../utils/itemsToArray';
import { sortedArrayFromLinkedList } from '../utils/sortedArrayFromLinkedList';

const router = express.Router();

router.get('/user', async (req, res) => {
    // const userId = req.cookies[COOKIE_NAME];
    const userId = req.session.userId;
    if (!userId) {
        res.status(401).send(); 
        return;
    }
    try {
        let user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true
            }
        });
        res.json(user);
    } catch(err: any){
        res.status(400).send(err.message);
    }
});

router.post('/groups', async (req, res) => {
    let groups;
    const { userId } = req.body;
    if (!userId) {
        res.status(401).send(); 
        return;
    }
    try {
        groups = await prisma.group.findMany({
            where: { userId }
        });
        res.json(groups);
    } catch(err: any){
        res.status(400).send(err.message);
    }
});

router.get('/feed/:groupId', async (req, res) => {
    const { groupId } = req.params;
    try {
        let cols = await prisma.column.findMany({
            where: { groupId },
            include: {
                tasks: {
                    include: {
                        list: true
                    },
                }
            }
        }); 
        if (cols.length == 0) { res.json({columns: []}).send(); return; }
        let output = cols.map(column => {
            let tasks_ = Array<Task_>();
            if (column.tasks && column.tasks.length != 0) {
                const sorted =  sortedArrayFromLinkedList<TTaskItems>(column.tasks);
                tasks_ = sorted!.map(task => itemsToArray(task));
            };
            return ({ ...column, tasks: tasks_});
        });
        output =  sortedArrayFromLinkedList<Column & {tasks: Task_[]}>(output);
        const columns = output.map(column => {
            const { id, name, groupId, tasks } = column;
            return ({ id, name, groupId, tasks });
        })      
        res.json({columns});
    } catch(err: any){
        res.status(500).send(err.message);
    }
});

router.post('/addGroup', async (req, res) => {
    const { name, userId } = req.body;
    try {
        const newGroup = await prisma.group.create({
            data: { name, userId }
        });
        res.json({id: newGroup.id});
    } catch(err: any) {
        res.status(500).send(err.message);
    }
});

 router.post('/addTask', async (req, res) => {
    const { idParent, name } = req.body;
    if (!idParent || !name) { res.sendStatus(500); return; }
    try {
        const newTask = await addNewTask({ idParent, name });
        res.json({id: newTask.id});
    } catch(err: any) {
        res.status(500).send(err.message);
    }
 });

 router.post('/updateTask', async (req, res) => {
    const task: Task_ = req.body;
    let upd;
    try {
        upd = await updateTask(task);
        res.sendStatus(204); 
    } catch(err: any) {
        res.status(500).send(err.message);
    }
 });

 router.post('/moveTask', async (req, res) => {
    const data: TPropsMove = req.body;
    try {   
        const movedTask = await moveItem(data, {name: 'task', parentIdName: 'columnId'});
        res.sendStatus(204);
    } catch(err: any) {
        res.status(500).send(err.message);
    }
 });

 router.delete('/deleteTask/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteItem({ id, isDelete: true, tx: null }, 'task');
        res.sendStatus(204);
    } catch(err: any) {
        res.status(500).send(err.message);
    }
 });

// columns
 router.post('/addColumn', async (req, res) => {
    const { idParent, name } = req.body;
    if (!idParent || !name) { res.sendStatus(500); return; }
    try {
        const newColumn = await addNewColumn({ idParent, name });
        res.json({id: newColumn.id});
    } catch(err: any) {
    res.status(500).send(err.message);
    }
 });

 router.post('/updateColumn', async (req, res) => {
    const { id, name } = req.body;
    let upd: Column;
    try {
        upd = await updateColumn({ id, name });
        res.sendStatus(204);
    } 
    catch(err: any) { res.status(500).send(err.message);}
 });

 router.post('/moveColumn', async (req, res) => {
    const data: TPropsMove = req.body;
    try {   
        const moved = await moveItem(data, {name: 'column', parentIdName: 'groupId'});
        res.sendStatus(204);
    } catch(err: any){
        res.status(500).send(err.message);
    }
 });

 router.delete('/deleteColumn/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteItem({ id, isDelete: true, tx: null }, 'column');
        res.sendStatus(204);
    } catch(err: any){
        res.status(500).send(err.message);
    }
 });

export default router