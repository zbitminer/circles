import { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';

export default function AlbumEditor({ album, onSave, onDelete }) {
  const [form, setForm] = useState(album);
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Album title" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <input type="number" value={form.sort_order || 0} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} placeholder="Order" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-lg border border-input bg-background px-3 py-2 text-sm md:col-span-2" />
        <input value={form.cover_image_url || ''} onChange={e => setForm({ ...form, cover_image_url: e.target.value })} placeholder="Optional cover image URL" className="rounded-lg border border-input bg-background px-3 py-2 text-sm md:col-span-2" />
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button onClick={() => onDelete(album)} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /> Delete</button>
        <button onClick={() => onSave(form)} disabled={!form.title.trim()} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"><Save className="h-4 w-4" /> Save</button>
      </div>
    </div>
  );
}