import { NextResponse } from 'next/server';
import { prisma } from '@/src/app/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const updatedInfluencer = await prisma.influencer.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedInfluencer, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar o influencer', error);
    return NextResponse.json({ error: 'Erro ao atualizar influencer' }, { status: 500 });
  }
}