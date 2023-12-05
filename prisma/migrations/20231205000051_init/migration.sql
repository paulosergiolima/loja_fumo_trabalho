/*
  Warnings:

  - You are about to drop the `bought_product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bought_product` DROP FOREIGN KEY `bought_product_product_name_fkey`;

-- DropForeignKey
ALTER TABLE `bought_product` DROP FOREIGN KEY `bought_product_user_email_fkey`;

-- DropTable
DROP TABLE `bought_product`;
