/*
  Warnings:

  - You are about to drop the column `completed` on the `CapterProgress` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `ContentProgress` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `LevelProgress` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusProgress" AS ENUM ('TO_DO', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "CapterProgress" DROP COLUMN "completed",
ADD COLUMN     "status" "StatusProgress" NOT NULL DEFAULT 'TO_DO';

-- AlterTable
ALTER TABLE "ContentProgress" DROP COLUMN "completed",
ADD COLUMN     "status" "StatusProgress" NOT NULL DEFAULT 'TO_DO';

-- AlterTable
ALTER TABLE "LevelProgress" DROP COLUMN "completed",
ADD COLUMN     "status" "StatusProgress" NOT NULL DEFAULT 'TO_DO';
