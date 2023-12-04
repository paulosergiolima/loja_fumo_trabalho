/*
  Warnings:

  - You are about to drop the column `product_id` on the `bought_product` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `bought_product` table. All the data in the column will be lost.
  - Added the required column `product_name` to the `bought_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_email` to the `bought_product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bought_product` DROP FOREIGN KEY `bought_product_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `bought_product` DROP FOREIGN KEY `bought_product_user_id_fkey`;

-- AlterTable
ALTER TABLE `bought_product` DROP COLUMN `product_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `product_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_email` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `bought_product` ADD CONSTRAINT `bought_product_user_email_fkey` FOREIGN KEY (`user_email`) REFERENCES `user`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bought_product` ADD CONSTRAINT `bought_product_product_name_fkey` FOREIGN KEY (`product_name`) REFERENCES `product`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
