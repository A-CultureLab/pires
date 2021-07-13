/*
  Warnings:

  - Added the required column `orderKey` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Pet` ADD COLUMN `orderKey` INTEGER NOT NULL;
