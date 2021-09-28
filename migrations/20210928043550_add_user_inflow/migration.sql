/*
  Warnings:

  - You are about to drop the column `instagramId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `instagramId`,
    ADD COLUMN `inflow` VARCHAR(191) NOT NULL DEFAULT '기타';
