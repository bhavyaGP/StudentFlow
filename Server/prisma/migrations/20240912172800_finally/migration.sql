/*
  Warnings:

  - You are about to drop the column `stud_id` on the `achievement` table. All the data in the column will be lost.
  - You are about to drop the column `stud_id` on the `activitymarks` table. All the data in the column will be lost.
  - You are about to drop the column `stud_id` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `stud_id` on the `learningoutcomes` table. All the data in the column will be lost.
  - You are about to drop the column `stud_id` on the `monthlyattendance` table. All the data in the column will be lost.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stud_id` on the `student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rollno,activity_id]` on the table `ActivityMarks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rollno]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rollno` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rollno` to the `ActivityMarks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rollno` to the `Grades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rollno` to the `LearningOutcomes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rollno` to the `MonthlyAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `GRno` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rollno` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `achievement` DROP FOREIGN KEY `Achievement_stud_id_fkey`;

-- DropForeignKey
ALTER TABLE `activitymarks` DROP FOREIGN KEY `ActivityMarks_stud_id_fkey`;

-- DropForeignKey
ALTER TABLE `grades` DROP FOREIGN KEY `Grades_stud_id_fkey`;

-- DropForeignKey
ALTER TABLE `learningoutcomes` DROP FOREIGN KEY `LearningOutcomes_stud_id_fkey`;

-- DropForeignKey
ALTER TABLE `monthlyattendance` DROP FOREIGN KEY `MonthlyAttendance_stud_id_fkey`;

-- DropIndex
DROP INDEX `ActivityMarks_stud_id_activity_id_key` ON `activitymarks`;

-- DropIndex
DROP INDEX `Grades_stud_id_subject_id_idx` ON `grades`;

-- DropIndex
DROP INDEX `LearningOutcomes_stud_id_subject_id_idx` ON `learningoutcomes`;

-- AlterTable
ALTER TABLE `achievement` DROP COLUMN `stud_id`,
    ADD COLUMN `rollno` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `activitymarks` DROP COLUMN `stud_id`,
    ADD COLUMN `rollno` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `grades` DROP COLUMN `stud_id`,
    ADD COLUMN `rollno` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `learningoutcomes` DROP COLUMN `stud_id`,
    ADD COLUMN `rollno` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `monthlyattendance` DROP COLUMN `stud_id`,
    ADD COLUMN `rollno` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `student` DROP PRIMARY KEY,
    DROP COLUMN `stud_id`,
    ADD COLUMN `GRno` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `rollno` INTEGER NOT NULL,
    ADD PRIMARY KEY (`GRno`);

-- CreateIndex
CREATE INDEX `Achievement_rollno_idx` ON `Achievement`(`rollno`);

-- CreateIndex
CREATE UNIQUE INDEX `ActivityMarks_rollno_activity_id_key` ON `ActivityMarks`(`rollno`, `activity_id`);

-- CreateIndex
CREATE INDEX `Grades_rollno_subject_id_idx` ON `Grades`(`rollno`, `subject_id`);

-- CreateIndex
CREATE INDEX `LearningOutcomes_rollno_subject_id_idx` ON `LearningOutcomes`(`rollno`, `subject_id`);

-- CreateIndex
CREATE INDEX `MonthlyAttendance_rollno_idx` ON `MonthlyAttendance`(`rollno`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_rollno_key` ON `Student`(`rollno`);

-- AddForeignKey
ALTER TABLE `MonthlyAttendance` ADD CONSTRAINT `MonthlyAttendance_rollno_fkey` FOREIGN KEY (`rollno`) REFERENCES `Student`(`rollno`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grades` ADD CONSTRAINT `Grades_rollno_fkey` FOREIGN KEY (`rollno`) REFERENCES `Student`(`rollno`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LearningOutcomes` ADD CONSTRAINT `LearningOutcomes_rollno_fkey` FOREIGN KEY (`rollno`) REFERENCES `Student`(`rollno`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Achievement` ADD CONSTRAINT `Achievement_rollno_fkey` FOREIGN KEY (`rollno`) REFERENCES `Student`(`rollno`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityMarks` ADD CONSTRAINT `ActivityMarks_rollno_fkey` FOREIGN KEY (`rollno`) REFERENCES `Student`(`rollno`) ON DELETE RESTRICT ON UPDATE CASCADE;
