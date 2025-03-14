/*
  Warnings:

  - Added the required column `head_office` to the `Agencies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `active` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deactivation_date` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agencies" ADD COLUMN     "head_office" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL,
ADD COLUMN     "deactivation_date" TIMESTAMP(3) NOT NULL;
