-- CreateTable
CREATE TABLE `_notReadChatsNotReadUsers` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_notReadChatsNotReadUsers_AB_unique`(`A`, `B`),
    INDEX `_notReadChatsNotReadUsers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ChatRoom.updatedAt_index` ON `ChatRoom`(`updatedAt`);

-- AddForeignKey
ALTER TABLE `_notReadChatsNotReadUsers` ADD FOREIGN KEY (`A`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_notReadChatsNotReadUsers` ADD FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
