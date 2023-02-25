import express from 'express'
import { prisma } from './index';
import { Task_, TPropsMoveTask, TTaskItems } from './types';
import { addNewTask, deleteTask, moveTask, updateTask } from './utils/crudTask';
import { itemsToArray } from './utils/itemsToArray';
import { sortedArrayFromLinkedList } from './utils/sortedArrayFromLinkedList';

const router = express.Router();

router.get('/feed/:groupId', async (req, res) => {
    const { groupId } = req.params;
    try {
        let columns = await prisma.column.findMany({
            where: { groupId },
            include: {
                tasks: {
                    include: {
                        list: true
                    },
                }
            }
        }); 
        const output = columns.map(column => {
            let tasks_ = Array<Task_>();
            if (column.tasks && column.tasks.length != 0) {
                const sorted =  sortedArrayFromLinkedList<TTaskItems>(column.tasks);
                tasks_ = sorted!.map(task => itemsToArray(task));
            }
            return ({...column, tasks: tasks_});
        });      
        res.json({columns: output});
    } catch(error){
        console.log('err=', error);
        res.status(500).send(error);
    }
});

 router.post('/addTask', async (req, res) => {
    const { columnId, name } = req.body;
    if (!columnId || !name) res.sendStatus(500);
    try {
        const newTask = await addNewTask({ columnId, name });
        res.json({id: newTask.id});
    } catch(err: any) {
        res.sendStatus(500);
    }
 });

 router.post('/updateTask', async (req, res) => {
    const task: Task_ = req.body;
    const updatedTask = await updateTask(task);
    if (updatedTask)  { res.sendStatus(204); }
    else { res.sendStatus(500);}
 });

 router.post('/moveTask', async (req, res) => {
    const data: TPropsMoveTask = req.body;
    try {   
        const movedTask = await moveTask(data);
        res.sendStatus(204);
    } catch(err){
        res.sendStatus(500);
    }
 });

 router.delete('/deleteTask/:idTask', async (req, res) => {
    const { idTask } = req.params;
    const id = await deleteTask({ id: idTask, isDelete: true });
    if (id) {res.sendStatus(204);} 
    else {res.sendStatus(500);}
 });

export default router