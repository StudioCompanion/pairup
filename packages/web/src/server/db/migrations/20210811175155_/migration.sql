/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PAIRER', 'PAIREE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'PAIRER',
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "firstName" DROP DEFAULT,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP DEFAULT;

-- CreateTable
CREATE TABLE "PairerDetails" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobTitle" TEXT,
    "companyUrl" TEXT,
    "portfolioUrl" TEXT,
    "bio" TEXT,
    "disciplines" TEXT[],
    "twitter" TEXT,
    "instagram" TEXT,
    "linkedIn" TEXT,
    "github" TEXT,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PairerDetails_userId_unique" ON "PairerDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User.userId_unique" ON "User"("userId");

-- AddForeignKey
ALTER TABLE "PairerDetails" ADD FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
