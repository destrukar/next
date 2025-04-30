import { prisma } from "@/src/app/lib/prisma";
import { NextResponse } from "next/server";

// Função DELETE com a tipagem correta do segundo argumento
export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const parsedId = Number(id);

  // Verifica se o ID é válido
  if (isNaN(parsedId)) {
    return NextResponse.json({ erro: "ID inválido" }, { status: 400 });
  }

  try {
    // Deleta as avaliações associadas ao influencer
    await prisma.avaliacao.deleteMany({
      where: { influencerId: parsedId },
    });

    // Deleta o influencer
    await prisma.influencer.delete({
      where: { id: parsedId },
    });

    return NextResponse.json({ mensagem: "Influencer excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir influencer:", error);
    return NextResponse.json({ erro: "Erro ao excluir influencer" }, { status: 500 });
  }
}
