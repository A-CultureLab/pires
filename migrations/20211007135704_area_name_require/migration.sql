/*
  Warnings:

  - Made the column `name` on table `Area1` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Area2` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Area3` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Area1` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Area2` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Area3` MODIFY `name` VARCHAR(191) NOT NULL;
