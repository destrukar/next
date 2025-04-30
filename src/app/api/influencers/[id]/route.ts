import { prisma } from "@/src/app/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function DELETE(_: Request, { params }: Params) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ erro: "ID inválido" }, { status: 400 });
  }

  try {
    await prisma.influencer.delete({
      where: { id },
    });

    return NextResponse.json({ mensagem: "Influencer excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir influencer:", error);
    return NextResponse.json({ erro: "Erro ao excluir influencer" }, { status: 500 });
  }
}