/*
  Warnings:

  - You are about to drop the column `userId` on the `api_key` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `dstId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `srcId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `api_key` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `api_key` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dst_id` to the `message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `src_id` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "api_key" DROP CONSTRAINT "api_key_userId_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_dstId_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_srcId_fkey";

-- DropIndex
DROP INDEX "api_key.userId_unique";

-- AlterTable
ALTER TABLE "api_key" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "message" DROP COLUMN "createdAt",
DROP COLUMN "dstId",
DROP COLUMN "srcId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dst_id" INTEGER NOT NULL,
ADD COLUMN     "src_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users.username_unique" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "api_key.user_id_unique" ON "api_key"("user_id");

-- AddForeignKey
ALTER TABLE "api_key" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD FOREIGN KEY ("src_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD FOREIGN KEY ("dst_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
