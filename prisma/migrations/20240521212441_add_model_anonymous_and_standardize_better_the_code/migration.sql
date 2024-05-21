/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_user` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `id_player` on the `PlayerProgress` table. All the data in the column will be lost.
  - You are about to drop the column `id_player` on the `Reports` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_capter,id_user]` on the table `PlayerProgress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_userLogged` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `PlayerProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_user` to the `Reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "fk_admin";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "fk_player";

-- DropForeignKey
ALTER TABLE "PlayerProgress" DROP CONSTRAINT "fk_playerProgress_player";

-- DropForeignKey
ALTER TABLE "Privilegies" DROP CONSTRAINT "fk_privilegies_admin";

-- DropForeignKey
ALTER TABLE "Reports" DROP CONSTRAINT "fk_report_player";

-- DropIndex
DROP INDEX "index_admin";

-- DropIndex
DROP INDEX "PlayerProgress_id_capter_id_player_key";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "pk_admin",
DROP COLUMN "id_user",
ADD COLUMN     "id_userLogged" TEXT NOT NULL,
ADD CONSTRAINT "pk_admin" PRIMARY KEY ("id_userLogged");

-- AlterTable
ALTER TABLE "PlayerProgress" DROP COLUMN "id_player",
ADD COLUMN     "id_user" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reports" DROP COLUMN "id_player",
ADD COLUMN     "id_user" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "type";

-- DropTable
DROP TABLE "Player";

-- DropEnum
DROP TYPE "TypeUser";

-- CreateTable
CREATE TABLE "Anonymous" (
    "id_user" TEXT NOT NULL,

    CONSTRAINT "pk_anonymous" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "UserLogged" (
    "id_user" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(50),

    CONSTRAINT "pk_userLogeed" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE INDEX "index_anonymous" ON "Anonymous"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "UserLogged_email_key" ON "UserLogged"("email");

-- CreateIndex
CREATE INDEX "index_userLogged" ON "UserLogged"("id_user");

-- CreateIndex
CREATE INDEX "index_admin" ON "Admin"("id_userLogged");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerProgress_id_capter_id_user_key" ON "PlayerProgress"("id_capter", "id_user");

-- AddForeignKey
ALTER TABLE "Anonymous" ADD CONSTRAINT "fk_admin" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLogged" ADD CONSTRAINT "fk_admin" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "fk_admin" FOREIGN KEY ("id_userLogged") REFERENCES "UserLogged"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Privilegies" ADD CONSTRAINT "fk_privilegies_admin" FOREIGN KEY ("id_admin") REFERENCES "Admin"("id_userLogged") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "fk_report_player" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerProgress" ADD CONSTRAINT "fk_playerProgress_user" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
