/*
  Warnings:

  - A unique constraint covering the columns `[guid]` on the table `login` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_pessoas]` on the table `login` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guid]` on the table `titulos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "login" ADD COLUMN     "data_atualizacao" TIMESTAMP(3),
ADD COLUMN     "data_criacao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "guid" TEXT,
ADD COLUMN     "id_pessoas" INTEGER;

-- AlterTable
ALTER TABLE "titulos" ADD COLUMN     "data_atualizacao" TIMESTAMP(3),
ADD COLUMN     "data_criacao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "guid" TEXT,
ADD COLUMN     "id_externo" VARCHAR(150),
ADD COLUMN     "id_pessoas" INTEGER,
ADD COLUMN     "id_unidade_ies" INTEGER,
ADD COLUMN     "tipo_id_externo" VARCHAR(150);

-- CreateTable
CREATE TABLE "pessoas" (
    "id" SERIAL NOT NULL,
    "guid" TEXT NOT NULL,
    "id_externo" VARCHAR(150),
    "nome" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidade_ies_pessoas" (
    "id" SERIAL NOT NULL,
    "guid" TEXT NOT NULL,
    "id_pessoas" INTEGER NOT NULL,
    "id_unidade_ies" INTEGER NOT NULL,

    CONSTRAINT "unidade_ies_pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidade_ies" (
    "id" SERIAL NOT NULL,
    "guid" TEXT NOT NULL,
    "id_ies" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidade_ies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ies" (
    "id" SERIAL NOT NULL,
    "guid" TEXT NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" SERIAL NOT NULL,
    "guid" TEXT NOT NULL,
    "id_pessoas" INTEGER NOT NULL,
    "cep" VARCHAR(8) NOT NULL,
    "logradouro" VARCHAR(150) NOT NULL,
    "numero" VARCHAR(10) NOT NULL,
    "complemento" VARCHAR(100),
    "bairro" VARCHAR(50) NOT NULL,
    "cidade" VARCHAR(50) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails" (
    "id" SERIAL NOT NULL,
    "guid" TEXT NOT NULL,
    "id_pessoas" INTEGER NOT NULL,
    "contato" VARCHAR(100) NOT NULL,
    "validado" BOOLEAN NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "token_validacao" VARCHAR(150),
    "token_expiracao" TIMESTAMP(3),
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telefones" (
    "id" SERIAL NOT NULL,
    "guid" TEXT NOT NULL,
    "id_pessoas" INTEGER NOT NULL,
    "contato" VARCHAR(100) NOT NULL,
    "validado" BOOLEAN NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "whatsapp" BOOLEAN NOT NULL DEFAULT false,
    "token_validacao" VARCHAR(150),
    "token_expiracao" TIMESTAMP(3),
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "telefones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_guid_key" ON "pessoas"("guid");

-- CreateIndex
CREATE INDEX "pessoas_guid_idx" ON "pessoas"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "unidade_ies_pessoas_guid_key" ON "unidade_ies_pessoas"("guid");

-- CreateIndex
CREATE INDEX "unidade_ies_pessoas_guid_idx" ON "unidade_ies_pessoas"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "unidade_ies_guid_key" ON "unidade_ies"("guid");

-- CreateIndex
CREATE INDEX "unidade_ies_guid_idx" ON "unidade_ies"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "ies_guid_key" ON "ies"("guid");

-- CreateIndex
CREATE INDEX "ies_guid_idx" ON "ies"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "enderecos_guid_key" ON "enderecos"("guid");

-- CreateIndex
CREATE INDEX "enderecos_guid_idx" ON "enderecos"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "emails_guid_key" ON "emails"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "emails_token_validacao_key" ON "emails"("token_validacao");

-- CreateIndex
CREATE INDEX "emails_guid_idx" ON "emails"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "telefones_guid_key" ON "telefones"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "telefones_token_validacao_key" ON "telefones"("token_validacao");

-- CreateIndex
CREATE INDEX "telefones_guid_idx" ON "telefones"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "login_guid_key" ON "login"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "login_id_pessoas_key" ON "login"("id_pessoas");

-- CreateIndex
CREATE INDEX "login_guid_idx" ON "login"("guid");

-- CreateIndex
CREATE UNIQUE INDEX "titulos_guid_key" ON "titulos"("guid");

-- CreateIndex
CREATE INDEX "titulos_guid_idx" ON "titulos"("guid");

-- AddForeignKey
ALTER TABLE "login" ADD CONSTRAINT "login_id_pessoas_fkey" FOREIGN KEY ("id_pessoas") REFERENCES "pessoas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "titulos" ADD CONSTRAINT "titulos_id_pessoas_fkey" FOREIGN KEY ("id_pessoas") REFERENCES "pessoas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "titulos" ADD CONSTRAINT "titulos_id_unidade_ies_fkey" FOREIGN KEY ("id_unidade_ies") REFERENCES "unidade_ies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidade_ies_pessoas" ADD CONSTRAINT "unidade_ies_pessoas_id_pessoas_fkey" FOREIGN KEY ("id_pessoas") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidade_ies_pessoas" ADD CONSTRAINT "unidade_ies_pessoas_id_unidade_ies_fkey" FOREIGN KEY ("id_unidade_ies") REFERENCES "unidade_ies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidade_ies" ADD CONSTRAINT "unidade_ies_id_ies_fkey" FOREIGN KEY ("id_ies") REFERENCES "ies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enderecos" ADD CONSTRAINT "enderecos_id_pessoas_fkey" FOREIGN KEY ("id_pessoas") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_id_pessoas_fkey" FOREIGN KEY ("id_pessoas") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telefones" ADD CONSTRAINT "telefones_id_pessoas_fkey" FOREIGN KEY ("id_pessoas") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
