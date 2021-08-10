/*
  Warnings:

  - Made the column `addressId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_ibfk_1`;

-- AlterTable
ALTER TABLE `User` MODIFY `addressId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
