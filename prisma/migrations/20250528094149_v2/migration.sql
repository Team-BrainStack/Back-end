/*
  Warnings:

  - You are about to drop the column `isFavorite` on the `Memory` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Memory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Memory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Memory_userId_idx";

-- AlterTable
ALTER TABLE "Memory" DROP COLUMN "isFavorite",
DROP COLUMN "metadata";

-- CreateIndex
CREATE UNIQUE INDEX "Memory_userId_key" ON "Memory"("userId");
