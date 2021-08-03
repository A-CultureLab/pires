-- DropIndex
DROP INDEX `ChatRoom.updatedAt_recentChatCreatedAt_index` ON `ChatRoom`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `fcmToken` VARCHAR(191);

-- CreateIndex
CREATE INDEX `ChatRoom.recentChatCreatedAt_index` ON `ChatRoom`(`recentChatCreatedAt`);
