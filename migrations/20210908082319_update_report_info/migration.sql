/*
  Warnings:

  - Added the required column `reason` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reporterId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Report` ADD COLUMN `reason` TEXT NOT NULL,
    ADD COLUMN `reporterId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Report` ADD FOREIGN KEY (`reporterId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
