/*
  Warnings:

  - You are about to drop the column `id_orderLevel` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `id_level` on the `CapterProgress` table. All the data in the column will be lost.
  - You are about to drop the column `id_player_progress` on the `CapterProgress` table. All the data in the column will be lost.
  - You are about to drop the column `id_orderLevel` on the `LevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `id_orderLevel` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the `PlayerProgress` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_capter,id_user]` on the table `CapterProgress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_capter_progress,id_level]` on the table `LevelProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_order_level` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleGroup` to the `Capter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_capter` to the `CapterProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `CapterProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_level` to the `LevelProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_order_level` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "fk_subject_orderLevel";

-- DropForeignKey
ALTER TABLE "CapterProgress" DROP CONSTRAINT "fk_capterProgress_level";

-- DropForeignKey
ALTER TABLE "CapterProgress" DROP CONSTRAINT "fk_capterProgress_playerProgress";

-- DropForeignKey
ALTER TABLE "LevelProgress" DROP CONSTRAINT "fk_subject_orderLevel";

-- DropForeignKey
ALTER TABLE "PlayerProgress" DROP CONSTRAINT "fk_playerProgress_capter";

-- DropForeignKey
ALTER TABLE "PlayerProgress" DROP CONSTRAINT "fk_playerProgress_user";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "fk_subject_orderLevel";

-- DropIndex
DROP INDEX "CapterProgress_id_player_progress_id_level_key";

-- DropIndex
DROP INDEX "LevelProgress_id_orderLevel_id_capter_progress_key";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "id_orderLevel",
ADD COLUMN     "id_order_level" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Capter" ADD COLUMN     "titleGroup" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "CapterProgress" DROP COLUMN "id_level",
DROP COLUMN "id_player_progress",
ADD COLUMN     "exam_complete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "id_capter" TEXT NOT NULL,
ADD COLUMN     "id_user" TEXT NOT NULL,
ADD COLUMN     "levelId" TEXT;

-- AlterTable
ALTER TABLE "LevelProgress" DROP COLUMN "id_orderLevel",
ADD COLUMN     "id_level" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "id_orderLevel",
ADD COLUMN     "id_order_level" TEXT NOT NULL;

-- DropTable
DROP TABLE "PlayerProgress";

-- CreateTable
CREATE TABLE "ContentProgress" (
    "id" TEXT NOT NULL,
    "id_order_level" TEXT NOT NULL,
    "id_level_progress" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pk_contentProgress" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "index_contentProgress" ON "ContentProgress"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ContentProgress_id_order_level_id_level_progress_key" ON "ContentProgress"("id_order_level", "id_level_progress");

-- CreateIndex
CREATE UNIQUE INDEX "CapterProgress_id_capter_id_user_key" ON "CapterProgress"("id_capter", "id_user");

-- CreateIndex
CREATE UNIQUE INDEX "LevelProgress_id_capter_progress_id_level_key" ON "LevelProgress"("id_capter_progress", "id_level");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "fk_subject_orderLevel" FOREIGN KEY ("id_order_level") REFERENCES "OrderLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "fk_subject_orderLevel" FOREIGN KEY ("id_order_level") REFERENCES "OrderLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapterProgress" ADD CONSTRAINT "fk_capterProgress_capter" FOREIGN KEY ("id_capter") REFERENCES "Capter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapterProgress" ADD CONSTRAINT "fk_capterProgress_user" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapterProgress" ADD CONSTRAINT "CapterProgress_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelProgress" ADD CONSTRAINT "fk_levelProgress_level" FOREIGN KEY ("id_level") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentProgress" ADD CONSTRAINT "fk_contentProgress_levelProgress" FOREIGN KEY ("id_level_progress") REFERENCES "LevelProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentProgress" ADD CONSTRAINT "fk_contentProgress_orderLevel" FOREIGN KEY ("id_order_level") REFERENCES "OrderLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
