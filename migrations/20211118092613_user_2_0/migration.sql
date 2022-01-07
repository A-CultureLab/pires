/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `snsLoginId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `uniqueKey` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User.snsLoginId_unique` ON `User`;

-- DropIndex
DROP INDEX `User.email_unique` ON `User`;

-- DropIndex
DROP INDEX `User.uniqueKey_unique` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `email`,
    DROP COLUMN `snsLoginId`,
    DROP COLUMN `uniqueKey`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `profileId` VARCHAR(191) NOT NULL,
    ADD COLUMN `refreshToken` VARCHAR(191);

-- CreateIndex
CREATE UNIQUE INDEX `User.phone_unique` ON `User`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `User.profileId_unique` ON `User`(`profileId`);
