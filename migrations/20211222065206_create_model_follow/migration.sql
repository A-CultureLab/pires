/*
  Warnings:

  - You are about to drop the `_FollowersToFollowings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_FollowersToFollowings` DROP FOREIGN KEY `_followerstofollowings_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_FollowersToFollowings` DROP FOREIGN KEY `_followerstofollowings_ibfk_2`;

-- DropTable
DROP TABLE `_FollowersToFollowings`;

-- CreateTable
CREATE TABLE `Follow` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `targetUserId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `Follow.targetUserId_userId_createdAt_index`(`targetUserId`, `userId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Follow` ADD FOREIGN KEY (`targetUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
