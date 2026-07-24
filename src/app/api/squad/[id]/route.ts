import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getStore } from '@/lib/store-singleton';
import { buildPlayer } from '@/lib/squad-input';

export const runtime = 'nodejs';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  if (typeof body?.squadNo !== 'number') {
    return NextResponse.json({ error: 'squadNo is required' }, { status: 400 });
  }
  const player = buildPlayer(body, id);
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
