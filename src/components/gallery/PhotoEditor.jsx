import { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';

export default function PhotoEditor({ photo, albums, onSave, onDelete }) {
  const [form, setForm] = useState(photo);
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row">
      <img src={photo.image_url} alt="" className="h-24 w-full rounded-lg object-cover sm:w-24" />
      <div className="grid flex-1 gap-2 sm:grid-cols-2">
        <input value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Photo title" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <select value={form.album_id} onChange={e => setForm({ ...form, album_id: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">{albums.map(album => <option key={album.id} value={album.id}>{album.title}</option>)}</select>
        <input value={form.caption || ''} onChange={e => setForm({ ...form, caption: e.target.value })} placeholder="Caption" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <input type="number" value={form.sort_order || 0} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} placeholder="Order" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <div className="flex items-center justify-end gap-1 sm:flex-col">
        <button onClick={() => onSave(form)} className="rounded-lg p-2 text-primary hover:bg-primary/10" title="Save photo"><Save className="h-4 w-4" /></button>
        <button onClick={() => onDelete(photo.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10" title="Delete photo"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
}