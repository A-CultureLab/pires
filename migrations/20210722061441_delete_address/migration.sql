/*
  Warnings:

  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LocationImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `LocationImage` DROP FOREIGN KEY `LocationImage_ibfk_1`;

-- DropTable
DROP TABLE `Location`;

-- DropTable
DROP TABLE `LocationImage`;

-- CreateIndex
CREATE INDEX `Address.postcode_latitude_longitude_index` ON `Address`(`postcode`, `latitude`, `longitude`);
