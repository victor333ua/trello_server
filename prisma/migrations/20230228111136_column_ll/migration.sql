/*
  Warnings:

  - You are about to drop the column `index` on the `Column` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Column" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "prevId" TEXT,
    "groupId" TEXT NOT NULL,
    CONSTRAINT "Column_prevId_fkey" FOREIGN KEY ("prevId") REFERENCES "Column" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Column_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Column" ("groupId", "id", "name") SELECT "groupId", "id", "name" FROM "Column";
DROP TABLE "Column";
ALTER TABLE "new_Column" RENAME TO "Column";
CREATE UNIQUE INDEX "Column_name_key" ON "Column"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
