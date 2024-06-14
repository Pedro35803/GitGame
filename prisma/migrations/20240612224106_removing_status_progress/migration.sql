/*
  Warnings:

  - You are about to drop the column `status` on the `CapterProgress` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ContentProgress` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `LevelProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CapterProgress" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "ContentProgress" DROP COLUMN "status",
ADD COLUMN     "complete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "LevelProgress" DROP COLUMN "status";

-- DropEnum
DROP TYPE "StatusProgress";
