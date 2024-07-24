/*
  Warnings:

  - A unique constraint covering the columns `[teacher_email]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Teacher_teacher_email_key` ON `Teacher`(`teacher_email`);
