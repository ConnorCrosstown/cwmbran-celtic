import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getStore } from '@/lib/store-singleton';
import { buildPlayer } from '@/lib/squad-input';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getStore().listPlayers());
}

export async function POST(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  if (typeof body?.squadNo !== 'number') {
    return NextResponse.json({ error: 'squadNo is required' }, { status: 400 });
  }
  const id = typeof body.id === 'string' && body.id ? body.id : crypto.randomUUID();
  const player = buildPlayer(body, id);
  await getStore().savePlayer(player);
  return NextResponse.json(player);
}
