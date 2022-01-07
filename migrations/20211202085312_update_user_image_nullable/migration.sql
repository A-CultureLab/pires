/*
  Warnings:

  - You are about to drop the column `marketingEmailDate` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User.birth_gender_index` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `marketingEmailDate`,
    MODIFY `image` VARCHAR(191);

-- CreateIndex
CREATE INDEX `User.birth_gender_profileId_name_index` ON `User`(`birth`, `gender`, `profileId`, `name`);
