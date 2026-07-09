import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { LANGUAGES, FORMATS } from '@/lib/workshop-categories';
import WorkshopCategoryGrid from './WorkshopCategoryGrid';

export default function ParticipateForm() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', email: '', gender: '', location: '', language: 'Hebrew', other_language: '', format: 'In-person',
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
        inquiry_type: 'participate',
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
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A2744' }}>Thank you!</h3>
        <p className="text-sm" style={{ color: '#6b5c3e' }}>We received your request. We'll contact you when a group forms for your chosen workshops.</p>
        <button onClick={() => { setDone(false); setCategories([]); setForm({ first_name: '', last_name: '', phone: '', email: '', gender: '', location: '', language: 'Hebrew', format: 'In-person' }); }} className="mt-4 text-sm font-semibold" style={{ color: '#C9A84C' }}>Submit another request →</button>
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
        <Field label="Where would you like to participate? *"><input required value={form.location} onChange={(e) => set('location', e.target.value)} className={inputCls} placeholder="City / Area" /></Field>
        <Field label="Preferred language *">
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
      </div>

      <div>
        <p className="text-sm font-semibold mb-2" style={{ color: '#1A2744' }}>Which workshops would you like to attend?</p>
        <WorkshopCategoryGrid selected={categories} onToggle={setCategories} />
      </div>

      <p className="text-xs italic" style={{ color: '#6b5c3e' }}>◦ Workshops are subject to a minimum number of participants — we'll contact you when a group forms.</p>

      <button type="submit" disabled={submitting} className="w-full py-3 font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }}>
        {submitting ? 'Submitting...' : 'Submit Request'}
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