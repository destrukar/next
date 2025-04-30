import { prisma } from "@/src/app/lib/prisma";
import { NextResponse } from "next/server";


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
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
