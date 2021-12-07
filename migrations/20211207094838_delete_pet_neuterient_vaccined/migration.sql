/*
  Warnings:

  - You are about to drop the column `neutered` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `vaccinated` on the `Pet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Pet` DROP COLUMN `neutered`,
    DROP COLUMN `vaccinated`;
