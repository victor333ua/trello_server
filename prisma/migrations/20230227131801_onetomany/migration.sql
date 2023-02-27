-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "prevId" TEXT,
    "columnId" TEXT NOT NULL,
    "text" TEXT,
    CONSTRAINT "Task_prevId_fkey" FOREIGN KEY ("prevId") REFERENCES "Task" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Task_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("columnId", "id", "name", "prevId", "text") SELECT "columnId", "id", "name", "prevId", "text" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
