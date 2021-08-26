-- AlterTable
ALTER TABLE `ChatRoom` ADD COLUMN `type` ENUM('private', 'group') NOT NULL DEFAULT 'private';

-- CreateTable
CREATE TABLE `_notificatedUsersNotificatedChatRooms` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_notificatedUsersNotificatedChatRooms_AB_unique`(`A`, `B`),
    INDEX `_notificatedUsersNotificatedChatRooms_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_bookmarkedUsersBookmarkedChatRooms` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_bookmarkedUsersBookmarkedChatRooms_AB_unique`(`A`, `B`),
    INDEX `_bookmarkedUsersBookmarkedChatRooms_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_iBlockedUsersBlockMeUsers` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_iBlockedUsersBlockMeUsers_AB_unique`(`A`, `B`),
    INDEX `_iBlockedUsersBlockMeUsers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_iBlockedUsersBlockMeUsers` ADD FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_iBlockedUsersBlockMeUsers` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_notificatedUsersNotificatedChatRooms` ADD FOREIGN KEY (`A`) REFERENCES `ChatRoom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_notificatedUsersNotificatedChatRooms` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_bookmarkedUsersBookmarkedChatRooms` ADD FOREIGN KEY (`A`) REFERENCES `ChatRoom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_bookmarkedUsersBookmarkedChatRooms` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
