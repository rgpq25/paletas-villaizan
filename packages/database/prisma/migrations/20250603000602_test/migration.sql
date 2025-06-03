/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "dbo_User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "dbo_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dbo_Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "dbo_Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dbo_User_email_key" ON "dbo_User"("email");

-- AddForeignKey
ALTER TABLE "dbo_Post" ADD CONSTRAINT "dbo_Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "dbo_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
