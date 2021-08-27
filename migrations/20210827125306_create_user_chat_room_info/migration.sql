/*
  Warnings:

  - You are about to drop the `_ChatRoomToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_notificatedUsersNotificatedChatRooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_bookmarkedUsersBookmarkedChatRooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_ChatRoomToUser` DROP FOREIGN KEY `_ChatRoomToUser_ibfk_3`;

-- DropForeignKey
ALTER TABLE `_ChatRoomToUser` DROP FOREIGN KEY `_ChatRoomToUser_ibfk_2`;

-- DropForeignKey
ALTER TABLE `_notificatedUsersNotificatedChatRooms` DROP FOREIGN KEY `_notificatedUsersNotificatedChatRooms_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_notificatedUsersNotificatedChatRooms` DROP FOREIGN KEY `_notificatedUsersNotificatedChatRooms_ibfk_2`;

-- DropForeignKey
ALTER TABLE `_bookmarkedUsersBookmarkedChatRooms` DROP FOREIGN KEY `_bookmarkedUsersBookmarkedChatRooms_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_bookmarkedUsersBookmarkedChatRooms` DROP FOREIGN KEY `_bookmarkedUsersBookmarkedChatRooms_ibfk_2`;

-- DropTable
DROP TABLE `_ChatRoomToUser`;

-- DropTable
DROP TABLE `_notificatedUsersNotificatedChatRooms`;

-- DropTable
DROP TABLE `_bookmarkedUsersBookmarkedChatRooms`;

-- CreateTable
CREATE TABLE `UserChatRoomInfo` (
    `id` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bookmarked` BOOLEAN NOT NULL DEFAULT false,
    `notificated` BOOLEAN NOT NULL DEFAULT true,
    `userId` VARCHAR(191) NOT NULL,
    `chatRoomId` VARCHAR(191) NOT NULL,

    INDEX `UserChatRoomInfo.bookmarked_notificated_joinedAt_index`(`bookmarked`, `notificated`, `joinedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserChatRoomInfo` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserChatRoomInfo` ADD FOREIGN KEY (`chatRoomId`) REFERENCES `ChatRoom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
