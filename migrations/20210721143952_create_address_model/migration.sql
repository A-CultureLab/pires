/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `postcode` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User.postcode_birth_latitude_longitude_index` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `address`,
    DROP COLUMN `addressId`,
    DROP COLUMN `latitude`,
    DROP COLUMN `longitude`,
    DROP COLUMN `postcode`,
    ADD COLUMN `addressPostcode` VARCHAR(191) NOT NULL DEFAULT '1';

-- CreateTable
CREATE TABLE `Address` (
    `postcode` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `addressName` VARCHAR(191) NOT NULL,
    `buildingName` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `data` JSON NOT NULL,

    PRIMARY KEY (`postcode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `User.birth_addressPostcode_index` ON `User`(`birth`, `addressPostcode`);

-- AddForeignKey
ALTER TABLE `User` ADD FOREIGN KEY (`addressPostcode`) REFERENCES `Address`(`postcode`) ON DELETE CASCADE ON UPDATE CASCADE;
