import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { LANGUAGES, FORMATS } from '@/lib/workshop-categories';
import WorkshopCategoryGrid from './WorkshopCategoryGrid';

export default function LeadForm() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', email: '', gender: '', location: '', language: 'Hebrew', other_language: '', format: 'In-person',
    zoom_link: '', has_studio: false, studio_address: '', workshop_date: '', notes: '',
  });
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await base44.entities.WorkshopInquiry.create({
        ...form,
        inquiry_type: 'lead',
        workshop_categories: categories,
      });
      setDone(true);
    } catch (err) {
      alert(err?.response?.data?.error || 'Could not submit. Please try again.');
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
        <button onClick={() => { setDone(false); setCategories([]); }} className="mt-4 text-sm font-semibold" style={{ color: '#C9A84C' }}>Submit another →</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Field label="Where will you lead the workshop? *"><input required value={form.location} onChange={(e) => set('location', e.target.value)} className={inputCls} placeholder="City / Area" /></Field>
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
        <Field label="Workshop date"><input type="date" value={form.workshop_date} onChange={(e) => set('workshop_date', e.target.value)} className={inputCls} /></Field>
        <Field label="Notes"><input value={form.notes} onChange={(e) => set('notes', e.target.value)} className={inputCls} placeholder="Additional notes" /></Field>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2" style={{ color: '#1A2744' }}>Which workshop do you want to lead?</p>
        <WorkshopCategoryGrid selected={categories} onToggle={setCategories} />
      </div>

      <div className="text-xs italic space-y-1" style={{ color: '#6b5c3e' }}>
        <p>* Workshops are subject to a minimum number of participants — we'll contact you when a group forms.</p>
        <p>* Circles of Giving acts as a facilitator only and is not responsible for the nature of the engagement between parties.</p>
        <p>* To avoid discomfort, please do not request money from participants for activities through the site.</p>
      </div>

      <button type="submit" disabled={submitting} className="w-full py-3 font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" style={{ background: '#C9A84C', color: '#1A2744' }}>
        {submitting ? 'Submitting...' : 'Offer to Lead'}
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