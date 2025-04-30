import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  // Extrai o ID da URL: /api/influencers/[id]/avaliar
  const pathParts = req.nextUrl.pathname.split("/");
  const id = parseInt(pathParts[pathParts.indexOf("influencers") + 1]);

  const { avaliacao } = await req.json();

  if (isNaN(avaliacao)) {
    return new NextResponse("Nota inválida", { status: 400 });
  }

  try {
    await prisma.avaliacao.create({
      data: {
        nota: avaliacao,
        influencerId: id,
      },
    });

    return new NextResponse("Avaliação registrada", { status: 200 });
  } catch (error) {
    console.error("Erro ao registrar avaliação:", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}