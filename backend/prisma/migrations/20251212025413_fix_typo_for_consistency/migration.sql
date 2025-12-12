/*
  Warnings:

  - You are about to drop the column `weighed_at` on the `Pet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "weighed_at",
ADD COLUMN     "weighedAt" TIMESTAMP(3);
