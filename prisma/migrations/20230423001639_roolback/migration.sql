/*
  Warnings:

  - You are about to drop the column `createdAt` on the `login` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `login` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `titulos` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `titulos` table. All the data in the column will be lost.
  - You are about to drop the `permissoes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "permissoes" DROP CONSTRAINT "permissoes_loginId_fkey";

-- AlterTable
ALTER TABLE "login" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "titulos" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "permissoes";
