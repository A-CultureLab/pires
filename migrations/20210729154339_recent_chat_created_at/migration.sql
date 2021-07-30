-- DropIndex
DROP INDEX `ChatRoom.updatedAt_index` ON `ChatRoom`;

-- AlterTable
ALTER TABLE `ChatRoom` ADD COLUMN `recentChatCreatedAt` DATETIME(3);

-- CreateIndex
CREATE INDEX `ChatRoom.updatedAt_recentChatCreatedAt_index` ON `ChatRoom`(`updatedAt`, `recentChatCreatedAt`);
