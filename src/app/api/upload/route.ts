import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { uploadImage } from '@/lib/blob';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const url = await uploadImage(`uploads/${Date.now()}-${safeName}`, buffer);
  return NextResponse.json({ url });
}
