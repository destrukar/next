-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tarefa" (
    "id" SERIAL NOT NULL,
    "conteudo" TEXT NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "dt_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" TIMESTAMP(3) NOT NULL,
    "dt_delecao" TIMESTAMP(3),
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Tarefa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Tarefa" ADD CONSTRAINT "Tarefa_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
