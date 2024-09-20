-- CreateTable
CREATE TABLE `Student` (
    `stud_id` INTEGER NOT NULL AUTO_INCREMENT,
    `stud_fname` VARCHAR(191) NOT NULL,
    `stud_lname` VARCHAR(191) NOT NULL,
    `stud_std` INTEGER NOT NULL,
    `DOB` DATETIME(3) NOT NULL,
    `parent_contact` VARCHAR(191) NOT NULL,
    `parentname` VARCHAR(191) NOT NULL,
    `student_add` VARCHAR(191) NOT NULL,
    `teacher_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,

    PRIMARY KEY (`stud_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MonthlyAttendance` (
    `monthly_attendance_id` INTEGER NOT NULL AUTO_INCREMENT,
    `stud_id` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `total_present_days` INTEGER NOT NULL,
    `total_absent_days` INTEGER NOT NULL,
    `total_late_days` INTEGER NOT NULL,

    INDEX `MonthlyAttendance_stud_id_idx`(`stud_id`),
    PRIMARY KEY (`monthly_attendance_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grades` (
    `grade_id` INTEGER NOT NULL AUTO_INCREMENT,
    `stud_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `marks_obtained` INTEGER NOT NULL,
    `max_marks` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,

    INDEX `Grades_stud_id_subject_id_idx`(`stud_id`, `subject_id`),
    PRIMARY KEY (`grade_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LearningOutcomes` (
    `outcome_id` INTEGER NOT NULL AUTO_INCREMENT,
    `stud_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `outcome_description` VARCHAR(191) NOT NULL,
    `achieved` ENUM('ACHIEVED', 'NOT_ACHIEVED') NOT NULL,
    `date` DATETIME(3) NOT NULL,

    INDEX `LearningOutcomes_stud_id_subject_id_idx`(`stud_id`, `subject_id`),
    PRIMARY KEY (`outcome_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Achievement` (
    `achievement_id` INTEGER NOT NULL AUTO_INCREMENT,
    `stud_id` INTEGER NOT NULL,
    `achievement_title` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `student_std` INTEGER NOT NULL,

    INDEX `Achievement_stud_id_idx`(`stud_id`),
    PRIMARY KEY (`achievement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivityMarks` (
    `activity_marks_id` INTEGER NOT NULL AUTO_INCREMENT,
    `stud_id` INTEGER NOT NULL,
    `activity_id` INTEGER NOT NULL,
    `marks_obtained` DECIMAL(10, 2) NOT NULL,
    `total_marks` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `ActivityMarks_stud_id_activity_id_key`(`stud_id`, `activity_id`),
    PRIMARY KEY (`activity_marks_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Activity` (
    `activity_id` INTEGER NOT NULL AUTO_INCREMENT,
    `activity_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`activity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subject` (
    `subject_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`subject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teacher` (
    `teacher_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `teacher_fname` VARCHAR(191) NOT NULL,
    `teacher_lname` VARCHAR(191) NOT NULL,
    `allocated_standard` VARCHAR(191) NOT NULL,
    `teacher_email` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `DOB` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Teacher_username_key`(`username`),
    UNIQUE INDEX `Teacher_teacher_email_key`(`teacher_email`),
    PRIMARY KEY (`teacher_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SchoolSchema` (
    `school_id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_name` VARCHAR(191) NOT NULL,
    `school_dist` VARCHAR(191) NOT NULL,
    `school_add` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`school_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`teacher_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `SchoolSchema`(`school_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MonthlyAttendance` ADD CONSTRAINT `MonthlyAttendance_stud_id_fkey` FOREIGN KEY (`stud_id`) REFERENCES `Student`(`stud_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grades` ADD CONSTRAINT `Grades_stud_id_fkey` FOREIGN KEY (`stud_id`) REFERENCES `Student`(`stud_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grades` ADD CONSTRAINT `Grades_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LearningOutcomes` ADD CONSTRAINT `LearningOutcomes_stud_id_fkey` FOREIGN KEY (`stud_id`) REFERENCES `Student`(`stud_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LearningOutcomes` ADD CONSTRAINT `LearningOutcomes_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Achievement` ADD CONSTRAINT `Achievement_stud_id_fkey` FOREIGN KEY (`stud_id`) REFERENCES `Student`(`stud_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityMarks` ADD CONSTRAINT `ActivityMarks_stud_id_fkey` FOREIGN KEY (`stud_id`) REFERENCES `Student`(`stud_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityMarks` ADD CONSTRAINT `ActivityMarks_activity_id_fkey` FOREIGN KEY (`activity_id`) REFERENCES `Activity`(`activity_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `SchoolSchema`(`school_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
