import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getStore } from '@/lib/store-singleton';
import type { SquadPlayer } from '@/types/programme';

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
  const player: SquadPlayer = {
    id: typeof body.id === 'string' && body.id ? body.id : crypto.randomUUID(),
    squadNo: body.squadNo,
    firstName: String(body.firstName ?? ''),
    lastName: String(body.lastName ?? ''),
    position: String(body.position ?? ''),
    photoUrl: body.photoUrl ? String(body.photoUrl) : undefined,
    penPicture: body.penPicture ? String(body.penPicture) : undefined,
  };
  await getStore().savePlayer(player);
  return NextResponse.json(player);
}
