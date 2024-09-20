/*
  Warnings:

  - The primary key for the `activity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[activity_id]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subject_id]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `activitymarks` DROP FOREIGN KEY `ActivityMarks_activity_id_fkey`;

-- DropForeignKey
ALTER TABLE `grades` DROP FOREIGN KEY `Grades_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `learningoutcomes` DROP FOREIGN KEY `LearningOutcomes_subject_id_fkey`;

-- AlterTable
ALTER TABLE `activity` DROP PRIMARY KEY,
    MODIFY `activity_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`activity_id`);

-- AlterTable
ALTER TABLE `activitymarks` MODIFY `activity_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `grades` MODIFY `subject_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `learningoutcomes` MODIFY `subject_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subject` DROP PRIMARY KEY,
    MODIFY `subject_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`subject_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Activity_activity_id_key` ON `Activity`(`activity_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Subject_subject_id_key` ON `Subject`(`subject_id`);

-- AddForeignKey
ALTER TABLE `Grades` ADD CONSTRAINT `Grades_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LearningOutcomes` ADD CONSTRAINT `LearningOutcomes_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityMarks` ADD CONSTRAINT `ActivityMarks_activity_id_fkey` FOREIGN KEY (`activity_id`) REFERENCES `Activity`(`activity_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
