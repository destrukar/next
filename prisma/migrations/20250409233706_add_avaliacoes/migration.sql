/*
  Warnings:

  - You are about to drop the column `avaliacao` on the `Influencer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Influencer" DROP COLUMN "avaliacao";

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" SERIAL NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,
    "influencerId" INTEGER NOT NULL,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
