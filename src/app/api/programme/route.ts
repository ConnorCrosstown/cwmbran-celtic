import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getStore } from '@/lib/store-singleton';
import { normalizeProgrammeFields } from '@/lib/programme-input';
import type { Programme } from '@/types/programme';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(await getStore().listProgrammes());
}

export async function POST(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const id = typeof body.id === 'string' && body.id ? body.id : crypto.randomUUID();
  const fields = normalizeProgrammeFields(body, {
    status: 'draft',
    startingXI: [],
    substitutes: [],
    captain: null,
  });
  const programme: Programme = {
    id,
    slug: String(body.slug ?? id),
    ...fields,
    opponent: String(body.opponent ?? ''),
    date: String(body.date ?? ''),
    kickoff: String(body.kickoff ?? ''),
    competition: String(body.competition ?? ''),
    matchdayNumber: String(body.matchdayNumber ?? ''),
    referee: String(body.referee ?? ''),
    assistantRef1: String(body.assistantRef1 ?? ''),
    assistantRef2: String(body.assistantRef2 ?? ''),
    managersNotes: String(body.managersNotes ?? ''),
    teamNews: String(body.teamNews ?? ''),
    updatedAt: new Date().toISOString(),
  };
  await getStore().saveProgramme(programme);
  return NextResponse.json(programme);
}
