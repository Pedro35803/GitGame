/*
  Warnings:

  - The primary key for the `Activity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `id_level` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `id_assessment_level` on the `CapterProgress` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `CapterProgress` table. All the data in the column will be lost.
  - You are about to drop the column `id_subject_activity` on the `LevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `LevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `id_assessment_activity` on the `Objective` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Objective` table. All the data in the column will be lost.
  - You are about to drop the column `id_level` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the `Assessment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_capter,numberOrder]` on the table `Level` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_assessment` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_orderLevel` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_level` to the `CapterProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_orderLevel` to the `LevelProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_assessment` to the `Objective` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_orderLevel` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "fk_activity_level";

-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "fk_assessment_capter";

-- DropForeignKey
ALTER TABLE "CapterProgress" DROP CONSTRAINT "fk_capterProgress_assessment";

-- DropForeignKey
ALTER TABLE "CapterProgress" DROP CONSTRAINT "fk_capterProgress_level";

-- DropForeignKey
ALTER TABLE "LevelProgress" DROP CONSTRAINT "fk_levelProgress_activity";

-- DropForeignKey
ALTER TABLE "LevelProgress" DROP CONSTRAINT "fk_levelProgress_subject";

-- DropForeignKey
ALTER TABLE "Objective" DROP CONSTRAINT "fk_objective_activity";

-- DropForeignKey
ALTER TABLE "Objective" DROP CONSTRAINT "fk_objective_assessment";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "fk_subject_level";

-- DropIndex
DROP INDEX "index_activity";

-- DropIndex
DROP INDEX "Level_numberOrder_key";

-- AlterTable
ALTER TABLE "Activity" DROP CONSTRAINT "pk_activity",
DROP COLUMN "id",
DROP COLUMN "id_level",
DROP COLUMN "title",
ADD COLUMN     "id_assessment" TEXT NOT NULL,
ADD COLUMN     "id_orderLevel" TEXT NOT NULL,
ADD CONSTRAINT "pk_activity" PRIMARY KEY ("id_assessment");

-- AlterTable
ALTER TABLE "CapterProgress" DROP COLUMN "id_assessment_level",
DROP COLUMN "type",
ADD COLUMN     "id_level" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Level" ALTER COLUMN "numberOrder" DROP DEFAULT;
DROP SEQUENCE "Level_numberOrder_seq";

-- AlterTable
ALTER TABLE "LevelProgress" DROP COLUMN "id_subject_activity",
DROP COLUMN "type",
ADD COLUMN     "id_orderLevel" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Objective" DROP COLUMN "id_assessment_activity",
DROP COLUMN "type",
ADD COLUMN     "id_assessment" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlayerProgress" ADD COLUMN     "exam_complete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Privilegies" ADD COLUMN     "canReorderContentGame" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "id_level",
ADD COLUMN     "id_orderLevel" TEXT NOT NULL;

-- DropTable
DROP TABLE "Assessment";

-- DropEnum
DROP TYPE "TypeIdObjective";

-- DropEnum
DROP TYPE "TypeIdProgressCapter";

-- DropEnum
DROP TYPE "TypeIdProgressLevel";

-- CreateTable
CREATE TABLE "Assessement" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,

    CONSTRAINT "pk_assessment" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id_assessment" TEXT NOT NULL,
    "id_capter" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "pk_exam" PRIMARY KEY ("id_assessment")
);

-- CreateTable
CREATE TABLE "OrderLevel" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "id_level" TEXT NOT NULL,

    CONSTRAINT "pk_orderLevel" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exam_id_capter_key" ON "Exam"("id_capter");

-- CreateIndex
CREATE INDEX "index_exam" ON "Exam"("id_assessment");

-- CreateIndex
CREATE INDEX "index_orderLevel" ON "OrderLevel"("id", "id_level");

-- CreateIndex
CREATE UNIQUE INDEX "OrderLevel_id_level_order_key" ON "OrderLevel"("id_level", "order");

-- CreateIndex
CREATE INDEX "index_activity" ON "Activity"("id_assessment");

-- CreateIndex
CREATE UNIQUE INDEX "Level_id_capter_numberOrder_key" ON "Level"("id_capter", "numberOrder");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "fk_exam_capter" FOREIGN KEY ("id_capter") REFERENCES "Capter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "fk_exam_assessment" FOREIGN KEY ("id_assessment") REFERENCES "Assessement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "fk_activity_assessment" FOREIGN KEY ("id_assessment") REFERENCES "Assessement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "fk_subject_orderLevel" FOREIGN KEY ("id_orderLevel") REFERENCES "OrderLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objective" ADD CONSTRAINT "fk_objective_assessment" FOREIGN KEY ("id_assessment") REFERENCES "Assessement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLevel" ADD CONSTRAINT "fk_orderLevel_level" FOREIGN KEY ("id_level") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "fk_subject_orderLevel" FOREIGN KEY ("id_orderLevel") REFERENCES "OrderLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapterProgress" ADD CONSTRAINT "fk_capterProgress_level" FOREIGN KEY ("id_level") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelProgress" ADD CONSTRAINT "fk_subject_orderLevel" FOREIGN KEY ("id_orderLevel") REFERENCES "OrderLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
