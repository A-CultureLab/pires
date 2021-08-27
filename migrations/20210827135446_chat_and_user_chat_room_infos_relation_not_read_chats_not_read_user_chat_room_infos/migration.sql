/*
  Warnings:

  - You are about to drop the `_notReadChatsNotReadUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_notReadChatsNotReadUsers` DROP FOREIGN KEY `_notReadChatsNotReadUsers_ibfk_3`;

-- DropForeignKey
ALTER TABLE `_notReadChatsNotReadUsers` DROP FOREIGN KEY `_notReadChatsNotReadUsers_ibfk_2`;

-- DropTable
DROP TABLE `_notReadChatsNotReadUsers`;

-- CreateTable
CREATE TABLE `_notReadChatsNotReadUserChatRoomInfos` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_notReadChatsNotReadUserChatRoomInfos_AB_unique`(`A`, `B`),
    INDEX `_notReadChatsNotReadUserChatRoomInfos_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_notReadChatsNotReadUserChatRoomInfos` ADD FOREIGN KEY (`A`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_notReadChatsNotReadUserChatRoomInfos` ADD FOREIGN KEY (`B`) REFERENCES `UserChatRoomInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
