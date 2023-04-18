-- AlterTable
ALTER TABLE "login" ADD COLUMN     "expiracaoTokenRedefinicaoSenha" TIMESTAMP(3),
ADD COLUMN     "tokenRedefinicaoSenha" TEXT;
