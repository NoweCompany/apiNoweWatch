/*
  Warnings:

  - Added the required column `file_diretory` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Photo` ADD COLUMN `file_diretory` VARCHAR(191) NOT NULL;
