-- AlterTable
ALTER TABLE `Media` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `MediaComment` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `MediaReplyComment` MODIFY `content` TEXT NOT NULL;
