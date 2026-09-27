import { useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function useOfferPublisher(user, onSaved) {
  const id = useRef(null);
  const busy = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const publish = async (categories, { description, location, type, helpDetails }) => {
    if (busy.current || !user) return false;
    busy.current = true; setSubmitting(true); setError('');
    const categoryLabel = categories.map(c => c.subcategory || c.category).join(', ');
    const payload = {
      title: `${user.full_name || 'Community member'} — Offering: ${categoryLabel || description.trim().slice(0, 80) || 'Help'}`,
      description: description.trim() || `I'd like to offer my help${categoryLabel ? ` in: ${categoryLabel}` : ' to the community'}.`,
      organization: 'Community Volunteer', location: location.trim(), type,
      cause_category: categories[0]?.category || 'Other',
      cause_categories: [...new Set(categories.map(c => c.category))],
      offer_topics: categories.map(({ category, subcategory }) => ({ category, subcategory: subcategory || '' })),
      help_details: helpDetails.trim(), created_by_name: user.full_name || 'Community member', status: 'active',
    };
    try {
      if (id.current) await base44.entities.Opportunity.update(id.current, payload);
      else { const record = await base44.entities.Opportunity.create({ ...payload, applicants: [] }); id.current = record.id; }
      setSaved(true); onSaved?.(); return true;
    } catch (err) { setError(err?.message || 'Could not save your offer. Please try again.'); return false; }
    finally { busy.current = false; setSubmitting(false); }
  };
  const reset = () => { id.current = null; setSaved(false); setError(''); };
  return { publish, submitting, error, saved, reset };
}