-- CreateTable
CREATE TABLE `Activity` (
    `activity_id` INTEGER NOT NULL AUTO_INCREMENT,
    `activity_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`activity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendance` (
    `attendance_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`attendance_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grades` (
    `grade_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `marks_obtained` INTEGER NOT NULL,
    `max_marks` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `term` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`grade_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LearningOutcomes` (
    `outcome_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `outcome_description` VARCHAR(191) NOT NULL,
    `achieved` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`outcome_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SchoolSchema` (
    `school_id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_name` VARCHAR(191) NOT NULL,
    `school_dist` VARCHAR(191) NOT NULL,
    `school_add` VARCHAR(191) NOT NULL,
    `total_stud` INTEGER NOT NULL,
    `award_win` INTEGER NOT NULL,

    PRIMARY KEY (`school_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `stud_id` INTEGER NOT NULL AUTO_INCREMENT,
    `stud_fname` VARCHAR(191) NOT NULL,
    `stud_lname` VARCHAR(191) NOT NULL,
    `stud_std` INTEGER NOT NULL,
    `DOB` DATETIME(3) NOT NULL,
    `parent_contact` VARCHAR(191) NOT NULL,
    `teacher_id` INTEGER NULL,
    `school_id` INTEGER NULL,

    PRIMARY KEY (`stud_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentActivity` (
    `student_id` INTEGER NOT NULL,
    `activity_id` INTEGER NOT NULL,

    PRIMARY KEY (`student_id`, `activity_id`)
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
    `teacher_fname` VARCHAR(191) NOT NULL,
    `teacher_lname` VARCHAR(191) NOT NULL,
    `allocated_standard` VARCHAR(191) NOT NULL,
    `teacher_email` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NULL,

    PRIMARY KEY (`teacher_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`stud_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grades` ADD CONSTRAINT `Grades_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`stud_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grades` ADD CONSTRAINT `Grades_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LearningOutcomes` ADD CONSTRAINT `LearningOutcomes_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`stud_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LearningOutcomes` ADD CONSTRAINT `LearningOutcomes_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `SchoolSchema`(`school_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentActivity` ADD CONSTRAINT `StudentActivity_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`stud_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentActivity` ADD CONSTRAINT `StudentActivity_activity_id_fkey` FOREIGN KEY (`activity_id`) REFERENCES `Activity`(`activity_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `SchoolSchema`(`school_id`) ON DELETE SET NULL ON UPDATE CASCADE;
