/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Teacher_username_key` ON `Teacher`(`username`);
