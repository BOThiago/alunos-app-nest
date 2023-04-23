/*
  Warnings:

  - Added the required column `updatedAt` to the `login` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `titulos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "login" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "titulos" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "permissoes" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL DEFAULT 'user',
    "loginId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissoes_descricao_key" ON "permissoes"("descricao");

-- AddForeignKey
ALTER TABLE "permissoes" ADD CONSTRAINT "permissoes_loginId_fkey" FOREIGN KEY ("loginId") REFERENCES "login"("id") ON DELETE SET NULL ON UPDATE CASCADE;
