import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, CheckCircle } from 'lucide-react';
import CategorySearchFilters from '@/components/CategorySearchFilters';

const TYPES = ['In-person', 'Remote', 'Hybrid'];

export default function OfferForm({ user, onPosted }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('In-person');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [otherOffer, setOtherOffer] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCategories.length === 0) return;
    setSubmitting(true);

    const categoryLabel = selectedCategories.map(c => `${c.emoji} ${c.subcategory || c.category}`).join(', ');
    const mainCategory = selectedCategories[0].category;
    const otherText = otherOffer.trim() ? ` (Other: ${otherOffer.trim()})` : '';

    await base44.entities.Opportunity.create({
      title: `${user.full_name} — Offering: ${categoryLabel}${otherText}`,
      description: (description || `I'd like to offer my help in: ${categoryLabel}`) + otherText,
      organization: 'Community Volunteer',
      location: location || '',
      cause_category: mainCategory,
      type,
      applicants: [],
      created_by_id: user.id,
      created_by_name: user.full_name,
      status: 'active',
    });

    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="text-center py-16 rounded-2xl" style={{ background: '#E8F5F3', border: '1.5px solid #247D7D' }}>
        <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#247D7D' }} />
        <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A2744' }}>Your Offer Has Been Posted!</h3>
        <p className="text-sm mb-4" style={{ color: '#6b5c3e' }}>Community members who need your help will be able to find and connect with you.</p>
        <div className="flex gap-3 justify-center">
          <button           onClick={() => { setSubmitted(false); setSelectedCategories([]); setDescription(''); setLocation(''); setOtherOffer(''); }}
            className="px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90" style={{ background: '#D35E35', color: '#fff' }}>
            Post Another Offer
          </button>
          <button onClick={() => onPosted()}
            className="px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90" style={{ background: '#247D7D', color: '#fff' }}>
            View All Opportunities
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #D35E35' }}>
      <h2 className="font-display text-xl font-bold mb-1" style={{ color: '#1A2744' }}>Share What You'd Like to Offer</h2>
      <p className="text-xs mb-5" style={{ color: '#6b5c3e' }}>Select the areas where you can help, add details, and post your offer to the community.</p>

      {/* Category multi-select */}
      <div className="mb-5">
        <label className="block text-sm font-bold mb-2" style={{ color: '#1A2744' }}>What can you offer? *</label>
        <p className="text-xs mb-3" style={{ color: '#6b5c3e' }}>Select one or more topics across categories.</p>
        <CategorySearchFilters
          multiSelect
          selectedFilters={selectedCategories}
          onSelectFilters={setSelectedCategories}
          exclude={['Companionship', 'Home', 'Technology']}
        />
        <div className="mt-4">
          <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Other — describe anything else you'd like to offer</label>
          <input
            value={otherOffer}
            onChange={e => setOtherOffer(e.target.value)}
            className="w-full bg-white rounded-xl px-4 py-3 text-sm outline-none border focus:border-primary/30"
            style={{ borderColor: '#C9A84C' }}
            placeholder="e.g. I can also help with..."
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Tell us more about your offer</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-white rounded-xl px-4 py-3 text-sm outline-none border focus:border-primary/30 resize-none"
          style={{ borderColor: '#C9A84C' }}
          placeholder="e.g. I'm a professional chef and can teach cooking classes on weekends..."
        />
      </div>

      {/* Location + Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Your Location</label>
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full bg-white rounded-xl px-4 py-3 text-sm outline-none border focus:border-primary/30"
            style={{ borderColor: '#C9A84C' }}
            placeholder="e.g. Jerusalem"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>How can you help?</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full bg-white rounded-xl px-4 py-3 text-sm outline-none border focus:border-primary/30"
            style={{ borderColor: '#C9A84C' }}
          >
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || selectedCategories.length === 0}
        className="w-full py-3.5 font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ background: '#D35E35', color: '#fff' }}
      >
        <Send className="w-4 h-4" />
        {submitting ? 'Posting...' : 'Post My Offer'}
      </button>
    </form>
  );
}