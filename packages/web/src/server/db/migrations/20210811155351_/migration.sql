/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hashedPassword]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[salt]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedPassword` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "hashedPassword" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "salt" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User.hashedPassword_unique" ON "User"("hashedPassword");

-- CreateIndex
CREATE UNIQUE INDEX "User.salt_unique" ON "User"("salt");
