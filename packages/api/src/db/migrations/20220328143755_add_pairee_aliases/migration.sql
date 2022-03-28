-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "sentBy" "Role" NOT NULL DEFAULT E'PAIREE';

-- CreateTable
CREATE TABLE "PaireeAliases" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PaireeAliases_pkey" PRIMARY KEY ("firstName","lastName","email")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaireeAliases_email_key" ON "PaireeAliases"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PaireeAliases_userId_key" ON "PaireeAliases"("userId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_firstName_lastName_email_fkey" FOREIGN KEY ("firstName", "lastName", "email") REFERENCES "PaireeAliases"("firstName", "lastName", "email") ON DELETE RESTRICT ON UPDATE CASCADE;
