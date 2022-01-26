/*
  Warnings:

  - Added the required column `verificationCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verificationTimeout` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationCode" TEXT NOT NULL,
ADD COLUMN     "verificationTimeout" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
