'use client';

import { useEffect, useState } from 'react';
import type { SquadPlayer } from '@/types/programme';

const BLANK: Omit<SquadPlayer, 'id'> = {
  squadNo: 0, firstName: '', lastName: '', position: '', photoUrl: '', penPicture: '',
};

export default function SquadAdminPage() {
  const [players, setPlayers] = useState<SquadPlayer[]>([]);
  const [form, setForm] = useState<Omit<SquadPlayer, 'id'> & { id?: string }>({ ...BLANK });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch('/api/squad');
    setPlayers(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function uploadPhoto(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setForm((f) => ({ ...f, photoUrl: url }));
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const editing = Boolean(form.id);
    await fetch(editing ? `/api/squad/${form.id}` : '/api/squad', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...form, squadNo: Number(form.squadNo) }),
    });
    setForm({ ...BLANK });
    setSaving(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this player?')) return;
    await fetch(`/api/squad/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Squad</h1>

      <form onSubmit={save} className="mb-8 grid grid-cols-2 gap-3 rounded border p-4">
        <input type="number" placeholder="No." value={form.squadNo || ''} required
          onChange={(e) => setForm({ ...form, squadNo: Number(e.target.value) })}
          className="rounded border px-2 py-1" />
        <input placeholder="Position" value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          className="rounded border px-2 py-1" />
        <input placeholder="First name" value={form.firstName} required
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="rounded border px-2 py-1" />
        <input placeholder="Last name" value={form.lastName} required
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="rounded border px-2 py-1" />
        <textarea placeholder="Pen picture" value={form.penPicture}
          onChange={(e) => setForm({ ...form, penPicture: e.target.value })}
          className="col-span-2 rounded border px-2 py-1" rows={2} />
        <input type="file" accept="image/*"
          onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
          className="col-span-2" />
        <button type="submit" disabled={saving}
          className="col-span-2 rounded bg-green-700 px-4 py-2 font-semibold text-white disabled:opacity-50">
          {form.id ? 'Update player' : 'Add player'}
        </button>
      </form>

      <ul className="divide-y">
        {players.map((p) => (
          <li key={p.id} className="flex items-center justify-between py-2">
            <span>#{p.squadNo} {p.firstName} {p.lastName} — {p.position}</span>
            <span className="space-x-3">
              <button onClick={() => setForm(p)} className="text-blue-600">Edit</button>
              <button onClick={() => remove(p.id)} className="text-red-600">Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
