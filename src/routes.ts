import express from 'express'
import { prisma } from './index';

const router = express.Router();

router.get('/feed/:groupId', async (req, res) => {
    const { groupId } = req.params;
    try {
        const columns = await prisma.column.findMany({
            where: { groupId:  Number(groupId)},
            orderBy: { index: 'asc' },
            include: {
                tasks: {
                    orderBy: { index: 'asc'},
                    include: {
                        list: true
                    }
                }
            }
        });
        res.json({columns});
    } catch(error){
        console.log('err=', error);
        res.status(500).send(error);
    }
});

// router.post(/upsertColumn,)

// router.post(/upsertTask,)

// router.post(/upsertItem,)














export default router