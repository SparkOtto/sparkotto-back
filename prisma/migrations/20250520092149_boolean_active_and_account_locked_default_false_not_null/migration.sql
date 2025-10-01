/*
  Warnings:

  - Made the column `account_locked` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `active` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "account_locked" SET NOT NULL,
ALTER COLUMN "account_locked" SET DEFAULT false,
ALTER COLUMN "active" SET NOT NULL,
ALTER COLUMN "active" SET DEFAULT false;
