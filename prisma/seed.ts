import { PrismaClient } from '@prisma/client';
import { addNewTask, updateTask } from '../src/utils/crudTask'

const prisma = new PrismaClient();

async function main() {
    const group = await prisma.group.create({
        data: { name: 'home',
                columns: {
                    create: [
                        {
                            name: 'ToDo',
                            index: 0,
                            tasks: {
                              create: {
                                name: 'task1',
                                list: {
                                  create: [
                                    { text: 'item1'},
                                    { text: 'item2'}
                                  ]
                                }
                              }
                            }
                        },
                        {
                            name: 'In Progress',
                            index: 1
                        },
                        {
                            name: 'Complete',
                            index: 2
                        },
                    ]
                }
              }
    });
    const column = await prisma.column.findUnique({
      where: { name: 'ToDo' },
      include: {
        tasks: true
      }
    });

    const newTask = await addNewTask({ columnId: column!.id, name: 'task2'});
    const task = await updateTask({
      ...newTask,
      text: 'sample for testing',
      list: [ 'item1', 'item2' ]
    });

    // console.log(group);
  };
  
  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
  