-- CreateEnum
CREATE TYPE "TypeIdObjective" AS ENUM ('assessment', 'activity');

-- CreateEnum
CREATE TYPE "TypeIdProgressCapter" AS ENUM ('assessment', 'level');

-- CreateEnum
CREATE TYPE "TypeIdProgressLevel" AS ENUM ('activity', 'subject');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(50),

    CONSTRAINT "pk_user" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id_user" TEXT NOT NULL,
    "second_password" VARCHAR(255) NOT NULL,

    CONSTRAINT "pk_admin" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Player" (
    "id_user" TEXT NOT NULL,
    "complete_game_percentage" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "pk_player" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Reports" (
    "id" TEXT NOT NULL,
    "id_player" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pk_report" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Capter" (
    "id" TEXT NOT NULL,
    "id_assessment" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "pk_capter" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "id_capter" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "pk_assessment" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objective" (
    "id" TEXT NOT NULL,
    "id_assessment_activity" TEXT NOT NULL,
    "tipo" "TypeIdObjective" NOT NULL,
    "resolution" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "subjectId" TEXT,

    CONSTRAINT "pk_objective" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" TEXT NOT NULL,
    "id_capter" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "pk_level" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "id_level" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,

    CONSTRAINT "pk_activity" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "id_level" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "pk_subject" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerProgress" (
    "id" TEXT NOT NULL,
    "id_capter" TEXT NOT NULL,
    "id_player" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pk_playerProgress" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapterProgress" (
    "id" TEXT NOT NULL,
    "id_player_progress" TEXT NOT NULL,
    "id_assessment_level" TEXT NOT NULL,
    "tipo" "TypeIdProgressCapter" NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pk_capterProgress" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LevelProgress" (
    "id" TEXT NOT NULL,
    "id_subject_activity" TEXT NOT NULL,
    "id_capter_progress" TEXT NOT NULL,
    "tipo" "TypeIdProgressLevel" NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pk_levelProgress" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "index_user" ON "User"("id");

-- CreateIndex
CREATE INDEX "index_admin" ON "Admin"("id_user");

-- CreateIndex
CREATE INDEX "index_player" ON "Player"("id_user");

-- CreateIndex
CREATE INDEX "index_reports" ON "Reports"("id");

-- CreateIndex
CREATE INDEX "index_capter" ON "Capter"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_id_capter_key" ON "Assessment"("id_capter");

-- CreateIndex
CREATE INDEX "index_assessment" ON "Assessment"("id");

-- CreateIndex
CREATE INDEX "index_objective" ON "objective"("id");

-- CreateIndex
CREATE INDEX "index_level" ON "Level"("id");

-- CreateIndex
CREATE INDEX "index_activity" ON "Activity"("id");

-- CreateIndex
CREATE INDEX "index_subject" ON "Subject"("id");

-- CreateIndex
CREATE INDEX "index_playerProgress" ON "PlayerProgress"("id");

-- CreateIndex
CREATE INDEX "index_capterProgress" ON "CapterProgress"("id");

-- CreateIndex
CREATE INDEX "index_levelProgress" ON "LevelProgress"("id");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "fk_admin" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "fk_player" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "fk_report_player" FOREIGN KEY ("id_player") REFERENCES "Player"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "fk_assessment_capter" FOREIGN KEY ("id_capter") REFERENCES "Capter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objective" ADD CONSTRAINT "fk_objective_assessment" FOREIGN KEY ("id_assessment_activity") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objective" ADD CONSTRAINT "fk_objective_activity" FOREIGN KEY ("id_assessment_activity") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objective" ADD CONSTRAINT "objective_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "fk_level_capter" FOREIGN KEY ("id_capter") REFERENCES "Capter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "fk_activity_level" FOREIGN KEY ("id_level") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "fk_subject_level" FOREIGN KEY ("id_level") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerProgress" ADD CONSTRAINT "fk_playerProgress_capter" FOREIGN KEY ("id_capter") REFERENCES "Capter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerProgress" ADD CONSTRAINT "fk_playerProgress_player" FOREIGN KEY ("id_player") REFERENCES "Player"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapterProgress" ADD CONSTRAINT "fk_capterProgress_playerProgress" FOREIGN KEY ("id_player_progress") REFERENCES "PlayerProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapterProgress" ADD CONSTRAINT "fk_capterProgress_assessment" FOREIGN KEY ("id_assessment_level") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapterProgress" ADD CONSTRAINT "fk_capterProgress_level" FOREIGN KEY ("id_assessment_level") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelProgress" ADD CONSTRAINT "fk_levelProgress_capterProgress" FOREIGN KEY ("id_capter_progress") REFERENCES "CapterProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelProgress" ADD CONSTRAINT "fk_levelProgress_activity" FOREIGN KEY ("id_subject_activity") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelProgress" ADD CONSTRAINT "fk_levelProgress_subject" FOREIGN KEY ("id_subject_activity") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
