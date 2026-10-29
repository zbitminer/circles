import { useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function ContentPositionControl({ entity, item, onSaved }) {
  const [value, setValue] = useState(item.display_priority || 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await base44.entities[entity].update(item.id, { display_priority: Number(value) });
      await onSaved();
    } catch {
      setError('Could not save position. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  return <form onSubmit={save} className="flex flex-wrap items-center gap-2 text-xs">
    <label className="flex items-center gap-2 text-muted-foreground">Priority
      <input aria-label={`Display priority for ${item.title || 'this item'}`} type="number" required min="0" max="9999" step="1" value={value} onChange={e => setValue(e.target.value)} className="min-h-11 w-20 rounded-lg border border-input bg-background px-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
    </label>
    <button disabled={saving || Number(value) === (item.display_priority || 0)} className="min-h-11 rounded-lg border border-border px-3 font-semibold text-primary disabled:opacity-50">{saving ? 'Saving…' : 'Save order'}</button>
    {error && <p role="alert" className="w-full text-destructive">{error}</p>}
  </form>;
}