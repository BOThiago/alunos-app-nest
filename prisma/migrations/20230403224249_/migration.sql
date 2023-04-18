/*
  Warnings:

  - A unique constraint covering the columns `[tokenRedefinicaoSenha]` on the table `login` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "login_tokenRedefinicaoSenha_key" ON "login"("tokenRedefinicaoSenha");
