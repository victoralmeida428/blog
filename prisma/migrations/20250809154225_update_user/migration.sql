/*
  Warnings:

  - You are about to drop the column `email` on the `usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."usuario_email_key";

-- AlterTable
ALTER TABLE "public"."usuario" DROP COLUMN "email",
ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "usuario_username_key" ON "public"."usuario"("username");
