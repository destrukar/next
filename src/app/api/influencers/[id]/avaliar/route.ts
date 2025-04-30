import { NextResponse } from 'next/server';
import { prisma } from '@/src/app/lib/prisma';

// Definindo a função PUT corretamente com o tipo de parâmetros
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Acessando o parâmetro 'id' diretamente
    const { id } = params;

    // Obtendo os dados do corpo da requisição
    const data = await request.json();

    // Atualizando o influencer no banco de dados usando o ID da rota
    const updatedInfluencer = await prisma.influencer.update({
      where: { id: parseInt(id) }, // Usando o ID como inteiro
      data: data, // Atualizando com os dados recebidos
    });

    // Retornando a resposta em formato JSON
    return NextResponse.json(updatedInfluencer, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar influencer:', error);
    return NextResponse.json({ error: 'Erro ao atualizar influencer' }, { status: 500 });
  }
}
