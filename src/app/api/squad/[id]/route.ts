import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getStore } from '@/lib/store-singleton';
import type { SquadPlayer } from '@/types/programme';

export const runtime = 'nodejs';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const player: SquadPlayer = {
    id,
    squadNo: Number(body.squadNo),
    firstName: String(body.firstName ?? ''),
    lastName: String(body.lastName ?? ''),
    position: String(body.position ?? ''),
    photoUrl: body.photoUrl ? String(body.photoUrl) : undefined,
    penPicture: body.penPicture ? String(body.penPicture) : undefined,
  };
  await getStore().savePlayer(player);
  return NextResponse.json(player);
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await getStore().deletePlayer(id);
  return NextResponse.json({ ok: true });
}
