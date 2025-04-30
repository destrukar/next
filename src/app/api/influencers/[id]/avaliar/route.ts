import { Request, NextResponse } from 'next/server';
import { prisma } from '@/src/app/lib/prisma';

// Ajustando a assinatura da função para compatibilidade com o Next.js 13+
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;  // Aqui pegamos o ID diretamente dos parâmetros

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
