/*
  Warnings:

  - You are about to drop the column `number` on the `Capter` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Level` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[numberOrder]` on the table `Capter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numberOrder]` on the table `Level` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Capter" DROP COLUMN "number",
ADD COLUMN     "numberOrder" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Level" DROP COLUMN "number",
ADD COLUMN     "numberOrder" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Capter_numberOrder_key" ON "Capter"("numberOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Level_numberOrder_key" ON "Level"("numberOrder");
