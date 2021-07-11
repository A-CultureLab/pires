/*
  Warnings:

  - You are about to drop the column `x` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `User` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User.postcode_birth_x_y_index` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `x`,
    DROP COLUMN `y`,
    ADD COLUMN `addressId` VARCHAR(191) NOT NULL,
    ADD COLUMN `latitude` DOUBLE NOT NULL,
    ADD COLUMN `longitude` DOUBLE NOT NULL;

-- CreateIndex
CREATE INDEX `User.postcode_birth_latitude_longitude_index` ON `User`(`postcode`, `birth`, `latitude`, `longitude`);
