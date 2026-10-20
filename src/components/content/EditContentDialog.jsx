import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const inputCls = 'w-full bg-muted rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-primary/40';

export default function EditContentDialog({ type, item, onClose, onSaved }) {
  const [form, setForm] = useState(() => Object.fromEntries(type.fields.map((f) => [f.key, item[f.key] ?? ''])));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const data = {};
    type.fields.forEach((f) => {
      const v = form[f.key];
      if (f.type === 'number') data[f.key] = v === '' ? undefined : Number(v);
      else data[f.key] = v;
    });
    try {
      await base44.entities[type.key].update(item.id, data);
      onSaved({ ...item, ...data });
    } catch {
      setError('Could not save changes. Please try again.');
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit {type.label.toLowerCase()}</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-3">
          {type.fields.map((f) => (
            <label key={f.key} className="block text-xs font-semibold">
              {f.label}
              {f.type === 'textarea' ? (
                <textarea rows={4} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={`${inputCls} mt-1 resize-none`} />
              ) : (
                <input type={f.type} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={`${inputCls} mt-1`} />
              )}
            </label>
          ))}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}