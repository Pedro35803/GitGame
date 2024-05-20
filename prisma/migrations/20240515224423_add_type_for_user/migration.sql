/*
  Warnings:

  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeUser" AS ENUM ('anonymous', 'logged');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" "TypeUser" NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
