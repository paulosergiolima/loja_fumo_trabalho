/*
  Warnings:

  - Added the required column `img_path` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `img_path` VARCHAR(191) NOT NULL;
