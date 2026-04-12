/*
  Warnings:

  - You are about to drop the column `descriptionRu` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `titleRu` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `contentRu` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `titleRu` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `titleRu` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `textRu` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `textRu` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `lang` on the `User` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_userId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizResult" DROP CONSTRAINT "QuizResult_userId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "descriptionRu",
DROP COLUMN "imageUrl",
DROP COLUMN "organizationId",
DROP COLUMN "titleRu",
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "level" "CourseLevel" NOT NULL DEFAULT 'BEGINNER',
ADD COLUMN     "price" DECIMAL(10,2),
ADD COLUMN     "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "contentRu",
DROP COLUMN "titleRu";

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "titleRu";

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "textRu";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "textRu";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lang";

-- DropEnum
DROP TYPE "Lang";

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
