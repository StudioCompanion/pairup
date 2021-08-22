-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PAIRER', 'PAIREE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'PAIRER',
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PairerDetails" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobTitle" TEXT NOT NULL,
    "companyUrl" TEXT NOT NULL,
    "portfolioUrl" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "disciplines" TEXT[],
    "twitter" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "linkedin" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timezone" TEXT NOT NULL,
    "monday" JSONB[],
    "tuesday" JSONB[],
    "wednesday" JSONB[],
    "thursday" JSONB[],
    "friday" JSONB[],
    "saturday" JSONB[],
    "sunday" JSONB[],
    "userId" TEXT NOT NULL,

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
CREATE UNIQUE INDEX "PairerDetails.userId_unique" ON "PairerDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Availability.userId_unique" ON "Availability"("userId");

-- AddForeignKey
ALTER TABLE "PairerDetails" ADD FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairerDetails" ADD FOREIGN KEY ("userId") REFERENCES "Availability"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
