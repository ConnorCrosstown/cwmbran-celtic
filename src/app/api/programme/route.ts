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
  const now = new Date().toISOString();
  const fields = normalizeProgrammeFields(body, {
    status: 'draft',
    opponent: '', date: '', kickoff: '', competition: '', matchdayNumber: '',
    venue: 'home', team: 'mens',
    startingXI: [], substitutes: [], captain: null,
    referee: '', assistantRef1: '', assistantRef2: '', fourthOfficial: '',
    matchSponsor: '', mascotSponsor: '', matchballSponsor: '', programmePrice: '',
    managersNotes: '', teamNews: '', specialNotes: '', playerToWatch: null,
    coverImage: '', actionImage: '', createdAt: now,
  });
  const programme: Programme = {
    id,
    slug: String(body.slug ?? id),
    ...fields,
    updatedAt: now,
  };
  await getStore().saveProgramme(programme);
  return NextResponse.json(programme);
}
