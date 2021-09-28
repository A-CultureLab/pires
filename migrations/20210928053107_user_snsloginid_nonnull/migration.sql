/*
  Warnings:

  - A unique constraint covering the columns `[snsLoginId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `snsLoginId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `snsLoginId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User.snsLoginId_unique` ON `User`(`snsLoginId`);
