import { PrismaClient } from '@prisma/client';

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
                                index: 0,
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
    console.log(group);
  };
  
  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
  