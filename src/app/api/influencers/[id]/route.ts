import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  // Extrai o ID da URL: /api/influencers/[id]
  const pathParts = request.nextUrl.pathname.split("/");
  const id = Number(pathParts[pathParts.indexOf("influencers") + 1]);

  if (isNaN(id)) {
    return NextResponse.json({ erro: "ID inválido" }, { status: 400 });
  }

  try {
    // Deleta as avaliações associadas ao influencer
    await prisma.avaliacao.deleteMany({
      where: { influencerId: id },
    });

    // Deleta o influencer
    await prisma.influencer.delete({
      where: { id },
    });

    return NextResponse.json({ mensagem: "Influencer excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir influencer:", error);
    return NextResponse.json({ erro: "Erro ao excluir influencer" }, { status: 500 });
  }
}