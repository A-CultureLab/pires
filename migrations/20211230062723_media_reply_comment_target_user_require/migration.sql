/*
  Warnings:

  - Made the column `targetUserId` on table `MediaReplyComment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `MediaReplyComment` DROP FOREIGN KEY `mediareplycomment_ibfk_2`;

-- AlterTable
ALTER TABLE `MediaReplyComment` MODIFY `targetUserId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `MediaReplyComment` ADD FOREIGN KEY (`targetUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
