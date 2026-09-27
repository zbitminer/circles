import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function WorkshopDetailsFields({ form, set }) {
  const fields = [
    ['title', 'Workshop title *', 'text', true],
    ['city', 'City *', 'text', true],
    ['start_time', 'Start time * (Israel time)', 'time', true],
    ['end_date', 'End date (if different)', 'date', false],
    ['end_time', 'End time (Israel time)', 'time', false],
    ['image_url', 'Flyer picture URL (optional)', 'url', false],
  ];
  return <fieldset className="space-y-4 border-t border-border pt-4">
    <legend className="font-semibold text-foreground">Your workshop</legend>
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([key, label, type, required]) => <label key={key} className="block text-sm text-foreground">
        {label}<Input className="mt-1" type={type} required={required} value={form[key] || ''} min={key === 'end_date' ? form.workshop_date : undefined} onChange={e => set(key, e.target.value)} placeholder={key === 'city' ? 'Safed, Israel' : key === 'image_url' ? 'https://…' : undefined} />
      </label>)}
    </div>
    <label className="block text-sm text-foreground">Describe your workshop *<Textarea required className="mt-1" rows={5} value={form.description || ''} onChange={e => set('description', e.target.value)} placeholder="What will you teach, and what will participants do?" /></label>
    <label className="block text-sm text-foreground">Supplies to bring<Textarea className="mt-1" value={form.supplies || ''} onChange={e => set('supplies', e.target.value)} placeholder="List materials to bring or explain what you provide." /></label>
    <p className="text-xs text-muted-foreground">A flyer is generated from these details. Leave the picture URL empty to use the community learning image.</p>
  </fieldset>;
}