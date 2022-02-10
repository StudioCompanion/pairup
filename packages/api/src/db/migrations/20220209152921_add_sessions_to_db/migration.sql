-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "pairerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "portfolio" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "appointment" TEXT NOT NULL,
    "subjects" TEXT[],
    "message" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_pairerId_fkey" FOREIGN KEY ("pairerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
