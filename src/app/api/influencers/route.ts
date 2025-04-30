import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET (req: Request){
  const influencers = await prisma.influencer.findMany({
    include: {
      avaliacoes: true,
      comentarios: true,
    },
  });
  
  const influencersComMedia = influencers.map((inf) => {
    const totalNotas = inf.avaliacoes.reduce((soma, a) => soma + a.nota, 0);
    const media = inf.avaliacoes.length > 0 ? totalNotas / inf.avaliacoes.length : null;
  
    return {
      ...inf,
      mediaAvaliacao: media,
    };
  });
  
  // Ordenar pela média decrescente
  const rankingOrdenado = influencersComMedia.sort((a, b) => {
    if (b.mediaAvaliacao === null) return -1;
    if (a.mediaAvaliacao === null) return 1;
    return b.mediaAvaliacao - a.mediaAvaliacao;
  });
  
  return NextResponse.json(rankingOrdenado);
  
}