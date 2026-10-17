-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'DIRECTOR';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "field" TEXT;

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "directorId" TEXT NOT NULL,
    "employeeCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_code_key" ON "Company"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Company_directorId_key" ON "Company"("directorId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
