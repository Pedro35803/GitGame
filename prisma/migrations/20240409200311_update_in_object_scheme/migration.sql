/*
  Warnings:

  - You are about to drop the `objective` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "objective" DROP CONSTRAINT "fk_objective_activity";

-- DropForeignKey
ALTER TABLE "objective" DROP CONSTRAINT "fk_objective_assessment";

-- DropForeignKey
ALTER TABLE "objective" DROP CONSTRAINT "objective_subjectId_fkey";

-- DropTable
DROP TABLE "objective";

-- CreateTable
CREATE TABLE "Objective" (
    "id" TEXT NOT NULL,
    "id_assessment_activity" TEXT NOT NULL,
    "type" "TypeIdObjective" NOT NULL,
    "resolution" TEXT NOT NULL,
    "objective" TEXT NOT NULL,

    CONSTRAINT "pk_objective" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "index_objective" ON "Objective"("id");

-- AddForeignKey
ALTER TABLE "Objective" ADD CONSTRAINT "fk_objective_assessment" FOREIGN KEY ("id_assessment_activity") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objective" ADD CONSTRAINT "fk_objective_activity" FOREIGN KEY ("id_assessment_activity") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
