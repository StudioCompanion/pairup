/*
  Warnings:

  - You are about to drop the `PaireeAliases` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_firstName_lastName_email_fkey";

-- DropTable
DROP TABLE "PaireeAliases";

-- CreateTable
CREATE TABLE "PaireeAlias" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL DEFAULT E'',
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PaireeAlias_pkey" PRIMARY KEY ("firstName","lastName","email")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaireeAlias_email_key" ON "PaireeAlias"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PaireeAlias_userId_key" ON "PaireeAlias"("userId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_firstName_lastName_email_fkey" FOREIGN KEY ("firstName", "lastName", "email") REFERENCES "PaireeAlias"("firstName", "lastName", "email") ON DELETE RESTRICT ON UPDATE CASCADE;
