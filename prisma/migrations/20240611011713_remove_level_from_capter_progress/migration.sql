/*
  Warnings:

  - You are about to drop the column `levelId` on the `CapterProgress` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CapterProgress" DROP CONSTRAINT "CapterProgress_levelId_fkey";

-- AlterTable
ALTER TABLE "CapterProgress" DROP COLUMN "levelId";
