import { PrismaClient } from '@prisma/client';
import { addNewTask, updateTask } from '../src/utils/crudTask'
import { addNewColumn } from './../src/utils/crudColumn';

const prisma = new PrismaClient();

async function main() {
    const group = await prisma.group.create({
        data: { name: 'home',
                columns: {
                    create: [
                        {
                            name: 'ToDo',
                            tasks: {
                              create: {
                                name: 'task00',
                                list: {
                                  create: [
                                    { text: 'item1'},
                                    { text: 'item2'}
                                  ]
                                }
                              }
                            }
                        },
                    ]
                }
              }
    });

    let column = await addNewColumn({ idParent: group.id, name: 'In Progress'});
    let newTask = await addNewTask({ idParent: column!.id, name: 'task10'});
    const task = await updateTask({
      ...newTask,
      text: 'sample for testing',
      list: [ 'item1', 'item2' ]
    });
};
  
  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
  