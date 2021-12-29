/*
  Warnings:

  - You are about to drop the column `intagramKey` on the `Media` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Media` DROP COLUMN `intagramKey`,
    ADD COLUMN `instagramKey` VARCHAR(191);
