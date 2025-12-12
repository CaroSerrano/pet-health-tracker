/*
  Warnings:

  - Added the required column `gender` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `age` on the `Pet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "weighed_at" TIMESTAMP(3),
DROP COLUMN "age",
ADD COLUMN     "age" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "description" TEXT;
