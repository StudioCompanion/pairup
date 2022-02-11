-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'COMPLETE');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "status" "SessionStatus" NOT NULL DEFAULT E'ACTIVE';
