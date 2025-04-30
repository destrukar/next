import { NextResponse } from 'next/server';
import { prisma } from '@/src/app/lib/prisma';

// Exemplo de método PUT para a rota dinâmica
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Pegue o ID do parâmetro
    const { id } = params;

    // Aqui você pode processar a requisição PUT e usar o `id` para atualizar os dados
    const data = await request.json(); // Pegando os dados do corpo da requisição

    // Exemplo de atualização de um influencer no banco de dados
    const updatedInfluencer = await prisma.influencer.update({
      where: { id: parseInt(id) }, // Usando o ID da rota dinâmica
      data: data, // Atualize com os dados recebidos
    });

    return NextResponse.json(updatedInfluencer, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar influencer:', error);
    return NextResponse.json({ error: 'Erro ao atualizar influencer' }, { status: 500 });
  }
}
