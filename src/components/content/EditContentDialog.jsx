import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BottomSheetSelect from '@/components/ui/BottomSheetSelect';

const inputCls = 'w-full bg-muted rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-primary/40';

const toInput = (f, v) => {
  if (v == null) return f.default ?? '';
  if (f.type === 'datetime-local') {
    const d = new Date(v);
    if (isNaN(d)) return '';
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  return v;
};

// Edits an existing record (item.id set) or creates a new one (item without id, using item as defaults).
export default function EditContentDialog({ type, item, onClose, onSaved, title }) {
  const isNew = !item.id;
  const [form, setForm] = useState(() => Object.fromEntries(type.fields.map((f) => [f.key, toInput(f, item[f.key])])));
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
      else if (f.type === 'datetime-local') data[f.key] = v ? new Date(v).toISOString() : undefined;
      else data[f.key] = v === '' && (isNew || f.type === 'select') ? undefined : v;
    });
    try {
      const saved = isNew
        ? await base44.entities[type.key].create({ ...item, ...data })
        : await base44.entities[type.key].update(item.id, data);
      onSaved({ ...item, ...data, ...(saved || {}) });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Could not save changes. Please try again.');
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title || (isNew ? `New ${type.label.toLowerCase()}` : `Edit ${type.label.toLowerCase()}`)}</DialogTitle>
          <DialogDescription className="sr-only">Fill in the details below and save.</DialogDescription>
        </DialogHeader>
        <form onSubmit={save} className="space-y-3">
          {type.fields.map((f) => (
            <label key={f.key} className="block text-xs font-semibold">
              {f.label}{f.required ? ' *' : ''}
              {f.type === 'textarea' ? (
                <textarea rows={4} required={f.required} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={`${inputCls} mt-1 resize-none`} />
              ) : f.type === 'select' ? (
                <BottomSheetSelect
                  label={f.label}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  options={!f.required ? [{ value: '', label: '—' }, ...f.options] : f.options}
                  className={`${inputCls} mt-1`}
                />
              ) : f.key === 'image_url' ? (
                <div className="space-y-2 mt-1">
                  <input type="text" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder="Paste image URL or upload file below" className={inputCls} />
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
                      setForm((prev) => ({ ...prev, [f.key]: file_url }));
                    } catch {
                      setError('Could not upload image.');
                    }
                  }} className="text-xs text-muted-foreground file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground" />
                </div>
              ) : (
                <input type={f.type} required={f.required} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={`${inputCls} mt-1`} />
              )}
            </label>
          ))}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : isNew ? 'Create' : 'Save changes'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}