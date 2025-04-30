import { NextResponse } from 'next/server';
import { prisma } from '@/src/app/lib/prisma';
import type { NextRequest } from 'next/server';
import type { RouteHandlerContext } from 'next/dist/server/future/route-modules/app-route/module';

export async function PUT(
  request: Request,
  context: RouteHandlerContext
) {
  try {
    const id = parseInt(context.params.id);
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