/*
  Warnings:

  - You are about to drop the column `bearer_token` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `bearer_token`;
