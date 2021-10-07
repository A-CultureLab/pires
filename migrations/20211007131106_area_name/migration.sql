-- DropIndex
DROP INDEX `Area1.id_latitude_longitude_index` ON `Area1`;

-- DropIndex
DROP INDEX `Area2.id_latitude_longitude_index` ON `Area2`;

-- DropIndex
DROP INDEX `Area3.id_latitude_longitude_index` ON `Area3`;

-- AlterTable
ALTER TABLE `Area1` ADD COLUMN `name` VARCHAR(191);

-- AlterTable
ALTER TABLE `Area2` ADD COLUMN `name` VARCHAR(191);

-- AlterTable
ALTER TABLE `Area3` ADD COLUMN `name` VARCHAR(191);

-- CreateIndex
CREATE INDEX `Area1.name_latitude_longitude_index` ON `Area1`(`name`, `latitude`, `longitude`);

-- CreateIndex
CREATE INDEX `Area2.name_latitude_longitude_index` ON `Area2`(`name`, `latitude`, `longitude`);

-- CreateIndex
CREATE INDEX `Area3.name_latitude_longitude_index` ON `Area3`(`name`, `latitude`, `longitude`);
