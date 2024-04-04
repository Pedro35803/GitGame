/*
  Warnings:

  - You are about to drop the column `tipo` on the `CapterProgress` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `LevelProgress` table. All the data in the column will be lost.
  - You are about to drop the column `texto` on the `Reports` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `objective` table. All the data in the column will be lost.
  - Added the required column `type` to the `CapterProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `LevelProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `objective` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CapterProgress" DROP COLUMN "tipo",
ADD COLUMN     "type" "TypeIdProgressCapter" NOT NULL;

-- AlterTable
ALTER TABLE "LevelProgress" DROP COLUMN "tipo",
ADD COLUMN     "type" "TypeIdProgressLevel" NOT NULL;

-- AlterTable
ALTER TABLE "Reports" DROP COLUMN "texto",
ADD COLUMN     "text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "objective" DROP COLUMN "tipo",
ADD COLUMN     "type" "TypeIdObjective" NOT NULL;
