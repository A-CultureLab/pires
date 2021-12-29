/*
  Warnings:

  - You are about to drop the `_UserToMediaLikedUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_UserToMediaLikedUsers` DROP FOREIGN KEY `_usertomedialikedusers_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_UserToMediaLikedUsers` DROP FOREIGN KEY `_usertomedialikedusers_ibfk_2`;

-- DropTable
DROP TABLE `_UserToMediaLikedUsers`;

-- CreateTable
CREATE TABLE `MediaLike` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(191) NOT NULL,

    INDEX `MediaLike.createdAt_userId_mediaId_index`(`createdAt`, `userId`, `mediaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MediaLike` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MediaLike` ADD FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
