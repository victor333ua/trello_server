import express from 'express'
import { prisma } from './index';
import { Task_, TPropsMoveTask } from './types';
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
        let tasks_: Task_[] | null;
        const output = columns.map(column => {
            tasks_ = null;
            if (column.tasks && column.tasks.length != 0) {
                const sorted =  sortedArrayFromLinkedList(column.tasks);
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
    const newTask = await addNewTask({ columnId, name });
    res.json({id: newTask.id}); 
 });

 router.post('/updateTask', async (req, res) => {
    const task: Task_ = req.body;
    const updatedTask = await updateTask(task);
    if (updatedTask) res.status(400).send('success'); 
    else res.status(500);
 });

 router.post('/moveTask', async (req, res) => {
    const data: TPropsMoveTask = req.body;
    const movedTask = await moveTask(data);
    if (movedTask) res.status(400).send('success'); 
    else res.status(500);
 });

 router.delete('/deleteTask/:idTask', async (req, res) => {
    const { idTask } = req.params;
    const id = await deleteTask({ id: idTask, isDelete: true });
    if (id) res.status(400).send('success'); 
    else res.status(500);
 });

export default router