-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "Item_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("id", "taskId", "text") SELECT "id", "taskId", "text" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE TABLE "new_Column" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "prevId" TEXT,
    "groupId" TEXT NOT NULL,
    CONSTRAINT "Column_prevId_fkey" FOREIGN KEY ("prevId") REFERENCES "Column" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Column_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Column" ("groupId", "id", "name", "prevId") SELECT "groupId", "id", "name", "prevId" FROM "Column";
DROP TABLE "Column";
ALTER TABLE "new_Column" RENAME TO "Column";
CREATE UNIQUE INDEX "Column_name_key" ON "Column"("name");
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "prevId" TEXT,
    "columnId" TEXT NOT NULL,
    "text" TEXT,
    CONSTRAINT "Task_prevId_fkey" FOREIGN KEY ("prevId") REFERENCES "Task" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Task_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("columnId", "id", "name", "prevId", "text") SELECT "columnId", "id", "name", "prevId", "text" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
