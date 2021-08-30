/*
  Warnings:

  - You are about to drop the `_iBlockedUsersBlockMeUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_iBlockedUsersBlockMeUsers` DROP FOREIGN KEY `_iBlockedUsersBlockMeUsers_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_iBlockedUsersBlockMeUsers` DROP FOREIGN KEY `_iBlockedUsersBlockMeUsers_ibfk_2`;

-- AlterTable
ALTER TABLE `UserChatRoomInfo` ADD COLUMN `blocked` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `_iBlockedUsersBlockMeUsers`;
