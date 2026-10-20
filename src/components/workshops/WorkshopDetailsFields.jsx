import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function WorkshopDetailsFields({ form, set }) {
  const fields = [
    ['title', 'Workshop title *', 'text', true],
    ['city', 'City *', 'text', true],
    ['start_time', 'Start time * (Israel time)', 'time', true],
    ['end_date', 'End date (if different)', 'date', false],
    ['end_time', 'End time (Israel time)', 'time', false],
  ];
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      set('image_url', file_url);
    } catch {
      setUploadError('Could not upload the image. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  return <fieldset className="space-y-4 border-t border-border pt-4">
    <legend className="font-semibold text-foreground">Your workshop</legend>
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([key, label, type, required]) => <label key={key} className="block text-sm text-foreground">
        {label}<Input className="mt-1" type={type} required={required} value={form[key] || ''} min={key === 'end_date' ? form.workshop_date : undefined} onChange={e => set(key, e.target.value)} placeholder={key === 'city' ? 'Safed, Israel' : key === 'image_url' ? 'https://…' : undefined} />
      </label>)}
    </div>
    <div className="text-sm text-foreground">
      <label className="block">Workshop image (optional)
        <input type="file" accept="image/*" onChange={handleUpload} className="mt-1 block text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground cursor-pointer" />
      </label>
      <div className="mt-2 flex items-center gap-3">
        {uploading && <span className="text-xs text-muted-foreground">Uploading...</span>}
        {uploadError && <span role="alert" className="text-xs text-destructive">{uploadError}</span>}
        {form.image_url && !uploading && <>
          <img src={form.image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />
          <button type="button" onClick={() => set('image_url', '')} className="text-xs text-primary hover:underline">Remove</button>
        </>}
      </div>
    </div>
    <label className="block text-sm text-foreground">Describe your workshop *<Textarea required className="mt-1" rows={5} value={form.description || ''} onChange={e => set('description', e.target.value)} placeholder="What will you teach, and what will participants do?" /></label>
    <label className="block text-sm text-foreground">Supplies to bring<Textarea className="mt-1" value={form.supplies || ''} onChange={e => set('supplies', e.target.value)} placeholder="List materials to bring or explain what you provide." /></label>
    <p className="text-xs text-muted-foreground">A flyer is generated from these details. Skip the image to use the community learning image.</p>
  </fieldset>;
}