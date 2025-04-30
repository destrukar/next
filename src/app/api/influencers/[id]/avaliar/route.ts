
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { NextApiRequest } from 'next';

interface RouteContext {
  params: { id: string };
}
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = context.params;  // Aqui pegamos o ID diretamente dos parâmetros

    // Lê os dados da requisição
    const data = await request.json();

    // Atualiza o influencer no banco de dados usando o ID da rota
    const updatedInfluencer = await prisma.influencer.update({
      where: { id: parseInt(id) },  // Garantindo que o ID seja inteiro
      data,  // Atualizando com os dados recebidos
    });

    // Retorna a resposta com o influencer atualizado
    return Response.json(updatedInfluencer, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar o influencer', error);
    return Response.json({ error: 'Erro ao atualizar influencer' }, { status: 500 });
  }
}
