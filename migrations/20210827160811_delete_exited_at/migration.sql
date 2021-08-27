/*
  Warnings:

  - You are about to drop the column `exitedAt` on the `UserChatRoomInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `UserChatRoomInfo` DROP COLUMN `exitedAt`,
    MODIFY `joinedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3);
