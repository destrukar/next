import { prisma } from "@/src/app/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const { conteudo } = await req.json();

  try {
    const novoInfluencer = await prisma.influencer.create({
      data: {
        conteudo,
      },
    });

    return NextResponse.json(novoInfluencer);
  } catch (error) {
    console.error("Erro ao criar influencer (API):", error);
    return NextResponse.json({ erro: "Erro ao criar influencer" }, { status: 500 });
  }
}