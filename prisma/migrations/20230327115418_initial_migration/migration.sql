-- CreateTable
CREATE TABLE "login" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "change_password" BOOLEAN DEFAULT true,
    "email" TEXT,
    "ies" TEXT,
    "message" TEXT DEFAULT '',
    "name" TEXT,

    CONSTRAINT "login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "titulos" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "boleto_codigo" TEXT,
    "boleto_url" TEXT,
    "curso" TEXT,
    "favorecido" TEXT,
    "login_id" INTEGER NOT NULL,
    "pix_codigo" TEXT,
    "pix_url" TEXT,
    "situacao" TEXT,

    CONSTRAINT "titulos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "login_login_key" ON "login"("login");

-- AddForeignKey
ALTER TABLE "titulos" ADD CONSTRAINT "titulos_login_id_fkey" FOREIGN KEY ("login_id") REFERENCES "login"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
