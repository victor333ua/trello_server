import express from 'express'
import { prisma } from './index';
import { objToArray } from './utils/objToArray';

const router = express.Router();

router.get('/feed/:groupId', async (req, res) => {
    const { groupId } = req.params;
    try {
        let columns = await prisma.column.findMany({
            where: { groupId },
            orderBy: { index: 'asc' },
            include: {
                tasks: {
                    include: {
                        list: {
                            select: { text: true }
                        }
                    },
                    orderBy: { index: 'asc' }
                }
            }
        }); 
        columns = objToArray(columns);      
        res.json({columns});
    } catch(error){
        console.log('err=', error);
        res.status(500).send(error);
    }

//     const columns = await prisma.$queryRaw<Column[]>`
//     SELECT Column.name, 
//         (SELECT * FROM Task JOIN Column ON Task.columnId = Column.id) 
//     ) AS tasks
//     FROM Column 
//     ORDER BY 'Column.index' ASC
// `;
// router.post(/upsertColumn,)

// router.post(/upsertTask,)

// router.post(/upsertItem,)
});

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany();
        res.json(tasks);
    } catch(error){
        console.log('err=', error);
        res.status(500).send(error);
    }
});

export default router