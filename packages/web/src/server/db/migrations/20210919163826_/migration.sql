-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PAIRER', 'PAIREE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'PAIRER',
    "userId" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationCode" TEXT NOT NULL,
    "verificationTimeout" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.hashedPassword_unique" ON "User"("hashedPassword");

-- CreateIndex
CREATE UNIQUE INDEX "User.salt_unique" ON "User"("salt");

-- CreateIndex
CREATE UNIQUE INDEX "User.userId_unique" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User.verificationCode_unique" ON "User"("verificationCode");
