-- DropIndex
DROP INDEX `Character_id_key` ON `Character`;

-- AlterTable
ALTER TABLE `Character` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
