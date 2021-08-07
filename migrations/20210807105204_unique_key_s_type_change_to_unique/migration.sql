/*
  Warnings:

  - A unique constraint covering the columns `[uniqueKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `uniqueKey` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `uniqueKey` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User.uniqueKey_unique` ON `User`(`uniqueKey`);
