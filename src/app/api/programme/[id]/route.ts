import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getStore } from '@/lib/store-singleton';

export const runtime = 'nodejs';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const programme = await getStore().getProgramme(id);
  if (!programme) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(programme);
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const existing = await getStore().getProgramme(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
  await getStore().saveProgramme(updated);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await getStore().deleteProgramme(id);
  return NextResponse.json({ ok: true });
}
