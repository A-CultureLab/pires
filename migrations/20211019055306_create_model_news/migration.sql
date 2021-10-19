-- CreateTable
CREATE TABLE `News` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `link` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `News.link_unique`(`link`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterIndex
ALTER TABLE `User` RENAME INDEX `User_addressId_unique` TO `User.addressId_unique`;
