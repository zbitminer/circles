import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { LANGUAGES, FORMATS } from '@/lib/workshop-categories';
import { useQueryClient } from '@tanstack/react-query';
import useWorkshopAutofill from '@/components/workshops/useWorkshopAutofill';
import WorkshopDetailsFields from '@/components/workshops/WorkshopDetailsFields';
import WorkshopFlyer from '@/components/workshops/WorkshopFlyer';

export default function LeadForm({ onCreated }) {
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', email: '', gender: '', location: '', language: 'Hebrew', other_language: '', format: 'In-person',
    zoom_link: '', has_studio: false, studio_address: '', workshop_date: '', notes: '',
    title: '', description: '', supplies: '', city: '', start_time: '', end_date: '', end_time: '', image_url: '',
  });
  const { autofilling, autofillError } = useWorkshopAutofill(setForm);
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.description.trim()) {
      setError('Please enter a workshop title and description.'); return;
    }
    const endDate = form.end_date || form.workshop_date;
    if (endDate < form.workshop_date || (form.end_time && endDate === form.workshop_date && form.end_time <= form.start_time)) {
      setError('The end must be after the start of your workshop.'); return;
    }
    setSubmitting(true);
    try {
      const workshop = await base44.entities.WorkshopInquiry.create({
        ...form,
        title: form.title.trim(), description: form.description.trim(),
        end_date: endDate,
        inquiry_type: 'lead',
        status: 'scheduled',
        workshop_categories: [],
      });
      queryClient.invalidateQueries({ queryKey: ['workshop-listings'] });
      setDone(true);
      onCreated?.(workshop);
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not create your workshop. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-12 rounded-2xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <div className="text-5xl mb-4">🌟</div>
        <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A2744' }}>Thank you for offering to teach!</h3>
        <p className="text-sm" style={{ color: '#6b5c3e' }}>We received your workshop details and will be in touch soon.</p>
        <button onClick={() => { setDone(false); }} className="mt-4 text-sm font-semibold" style={{ color: '#C9A84C' }}>Create another →</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {autofilling && <p role="status" className="text-sm text-muted-foreground">Filling in your signup details…</p>}
      {autofillError && <p className="text-sm text-muted-foreground">Your saved contact details could not be loaded. You can enter them below.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name *"><input required value={form.first_name} onChange={(e) => set('first_name', e.target.value)} className={inputCls} placeholder="First name" /></Field>
        <Field label="Last Name *"><input required value={form.last_name} onChange={(e) => set('last_name', e.target.value)} className={inputCls} placeholder="Last name" /></Field>
        <Field label="Phone *"><input required type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} placeholder="Phone" /></Field>
        <Field label="Email *"><input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} placeholder="Email" /></Field>
        <Field label="I am *">
          <select required value={form.gender} onChange={(e) => set('gender', e.target.value)} className={inputCls}>
            <option value="" disabled>Select</option><option value="female">Woman</option><option value="male">Man</option>
          </select>
        </Field>
        <Field label="Venue / street address"><input required={form.format !== 'Zoom'} value={form.location} onChange={(e) => set('location', e.target.value)} className={inputCls} placeholder="Venue and street address" /></Field>
        <Field label="Language *">
          <select value={form.language} onChange={(e) => set('language', e.target.value)} className={inputCls}>
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>
        {form.language === 'Other' && (
          <Field label="Other language *"><input required value={form.other_language} onChange={(e) => set('other_language', e.target.value)} className={inputCls} placeholder="Specify language" /></Field>
        )}
        <Field label="Format *">
          <select value={form.format} onChange={(e) => set('format', e.target.value)} className={inputCls}>
            {FORMATS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </Field>
        {(form.format === 'Zoom' || form.format === 'Both') && (
          <Field label="Zoom link"><input type="url" value={form.zoom_link} onChange={(e) => set('zoom_link', e.target.value)} className={inputCls} placeholder="https://zoom.us/..." /></Field>
        )}
        <Field label="Do you have a studio? *">
          <select value={form.has_studio ? 'yes' : 'no'} onChange={(e) => set('has_studio', e.target.value === 'yes')} className={inputCls}>
            <option value="no">No</option><option value="yes">Yes</option>
          </select>
        </Field>
        {form.has_studio && (
          <Field label="Studio address"><input value={form.studio_address} onChange={(e) => set('studio_address', e.target.value)} className={inputCls} placeholder="Studio address" /></Field>
        )}
        <Field label="Workshop start date *"><input required type="date" value={form.workshop_date} onChange={(e) => set('workshop_date', e.target.value)} className={inputCls} /></Field>
        <Field label="Notes"><input value={form.notes} onChange={(e) => set('notes', e.target.value)} className={inputCls} placeholder="Additional notes" /></Field>
      </div>

      <WorkshopDetailsFields form={form} set={set} />
      <details className="rounded-xl border border-border p-4">
        <summary className="cursor-pointer font-medium text-primary">Preview generated flyer</summary>
        <div className="mt-4"><WorkshopFlyer workshop={form} preview /></div>
      </details>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <div className="text-xs italic space-y-1" style={{ color: '#6b5c3e' }}>
        <p>* Workshops are subject to a minimum number of participants — we'll contact you when a group forms.</p>
        <p>* Circles of Giving acts as a facilitator only and is not responsible for the nature of the engagement between parties.</p>
        <p>* To avoid discomfort, please do not request money from participants for activities through the site.</p>
      </div>

      <button type="submit" disabled={submitting} className="w-full py-3 font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" style={{ background: '#C9A84C', color: '#1A2744' }}>
        {submitting ? 'Creating workshop…' : 'Create Workshop'}
      </button>
    </form>
  );
}

const inputCls = "w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>{label}</label>
      {children}
    </div>
  );
}