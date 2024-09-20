/*
  Warnings:

  - You are about to drop the column `rollno` on the `achievement` table. All the data in the column will be lost.
  - Added the required column `GRno` to the `Achievement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `achievement` DROP FOREIGN KEY `Achievement_rollno_fkey`;

-- AlterTable
ALTER TABLE `achievement` DROP COLUMN `rollno`,
    ADD COLUMN `GRno` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Achievement_GRno_idx` ON `Achievement`(`GRno`);

-- AddForeignKey
ALTER TABLE `Achievement` ADD CONSTRAINT `Achievement_GRno_fkey` FOREIGN KEY (`GRno`) REFERENCES `Student`(`GRno`) ON DELETE RESTRICT ON UPDATE CASCADE;
