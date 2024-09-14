/*
  Warnings:

  - You are about to drop the `studentactivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `studentactivity` DROP FOREIGN KEY `StudentActivity_activity_id_fkey`;

-- DropForeignKey
ALTER TABLE `studentactivity` DROP FOREIGN KEY `StudentActivity_student_id_fkey`;

-- DropTable
DROP TABLE `studentactivity`;

-- CreateTable
CREATE TABLE `ActivityMarks` (
    `activity_marks_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `activity_id` INTEGER NOT NULL,
    `marks_obtained` DECIMAL(10, 2) NOT NULL,
    `total_marks` DECIMAL(10, 2) NOT NULL,
    `grade` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ActivityMarks_student_id_activity_id_key`(`student_id`, `activity_id`),
    PRIMARY KEY (`activity_marks_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ActivityMarks` ADD CONSTRAINT `ActivityMarks_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`stud_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityMarks` ADD CONSTRAINT `ActivityMarks_activity_id_fkey` FOREIGN KEY (`activity_id`) REFERENCES `Activity`(`activity_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
