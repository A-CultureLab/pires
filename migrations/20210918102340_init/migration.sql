-- CreateTable
CREATE TABLE `User` (
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `uniqueKey` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `birth` DATETIME(3) NOT NULL,
    `instagramId` VARCHAR(191),
    `introduce` TEXT NOT NULL,
    `agreementDate` DATETIME(3) NOT NULL,
    `marketingPushDate` DATETIME(3),
    `marketingEmailDate` DATETIME(3),
    `fcmToken` VARCHAR(191),
    `withdrawDate` DATETIME(3),
    `withdrawReason` TEXT,
    `addressId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User.email_unique`(`email`),
    UNIQUE INDEX `User.uniqueKey_unique`(`uniqueKey`),
    INDEX `User.birth_gender_index`(`birth`, `gender`),
    UNIQUE INDEX `User_addressId_unique`(`addressId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserChatRoomInfo` (
    `id` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `joinedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    `bookmarked` BOOLEAN NOT NULL DEFAULT false,
    `notificated` BOOLEAN NOT NULL DEFAULT true,
    `blocked` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,
    `chatRoomId` VARCHAR(191) NOT NULL,

    INDEX `UserChatRoomInfo.bookmarked_notificated_joinedAt_index`(`bookmarked`, `notificated`, `joinedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatRoom` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `recentChatCreatedAt` DATETIME(3),
    `type` ENUM('private', 'group') NOT NULL,

    INDEX `ChatRoom.recentChatCreatedAt_index`(`recentChatCreatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chat` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `message` VARCHAR(191),
    `image` VARCHAR(191),
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,
    `chatRoomId` VARCHAR(191) NOT NULL,

    INDEX `Chat.createdAt_userId_chatRoomId_index`(`createdAt`, `userId`, `chatRoomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `area1Id` VARCHAR(191) NOT NULL,
    `area2Id` VARCHAR(191) NOT NULL,
    `area3Id` VARCHAR(191) NOT NULL,
    `landId` VARCHAR(191) NOT NULL,

    INDEX `Address.area1Id_area2Id_area3Id_landId_index`(`area1Id`, `area2Id`, `area3Id`, `landId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Area1` (
    `id` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    INDEX `Area1.id_latitude_longitude_index`(`id`, `latitude`, `longitude`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Area2` (
    `id` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    INDEX `Area2.id_latitude_longitude_index`(`id`, `latitude`, `longitude`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Area3` (
    `id` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    INDEX `Area3.id_latitude_longitude_index`(`id`, `latitude`, `longitude`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Land` (
    `id` VARCHAR(191) NOT NULL,
    `addressName` VARCHAR(191) NOT NULL,
    `buildingName` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    INDEX `Land.id_latitude_longitude_index`(`id`, `latitude`, `longitude`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pet` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `orderKey` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `type` ENUM('cat', 'dog') NOT NULL,
    `species` VARCHAR(191) NOT NULL,
    `character` VARCHAR(191) NOT NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `birth` DATETIME(3) NOT NULL,
    `weight` DOUBLE NOT NULL,
    `neutered` BOOLEAN NOT NULL,
    `vaccinated` BOOLEAN NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `Pet.species_character_birth_weight_index`(`species`, `character`, `birth`, `weight`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `reason` TEXT NOT NULL,
    `reporterId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191),
    `chatId` VARCHAR(191),
    `chatRoomId` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_notReadChatsNotReadUserChatRoomInfos` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_notReadChatsNotReadUserChatRoomInfos_AB_unique`(`A`, `B`),
    INDEX `_notReadChatsNotReadUserChatRoomInfos_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserChatRoomInfo` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserChatRoomInfo` ADD FOREIGN KEY (`chatRoomId`) REFERENCES `ChatRoom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pet` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD FOREIGN KEY (`reporterId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD FOREIGN KEY (`chatId`) REFERENCES `Chat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD FOREIGN KEY (`chatRoomId`) REFERENCES `ChatRoom`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_notReadChatsNotReadUserChatRoomInfos` ADD FOREIGN KEY (`A`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_notReadChatsNotReadUserChatRoomInfos` ADD FOREIGN KEY (`B`) REFERENCES `UserChatRoomInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD FOREIGN KEY (`area1Id`) REFERENCES `Area1`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD FOREIGN KEY (`area2Id`) REFERENCES `Area2`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD FOREIGN KEY (`area3Id`) REFERENCES `Area3`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD FOREIGN KEY (`landId`) REFERENCES `Land`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD FOREIGN KEY (`chatRoomId`) REFERENCES `ChatRoom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
