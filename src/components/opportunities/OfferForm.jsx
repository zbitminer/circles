import { useState } from 'react';
import useOfferPublisher from '@/components/opportunities/useOfferPublisher';
import { Send } from 'lucide-react';
import CategorySearchFilters from '@/components/CategorySearchFilters';

const TYPES = ['In-person', 'Remote', 'Hybrid'];

export default function OfferForm({ user, onPosted, onSaved }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('In-person');
  const [helpDetails, setHelpDetails] = useState('');
  const { publish, submitting, error, saved } = useOfferPublisher(user, onSaved);
  const details = { description, location, type, helpDetails };
  const selectTopics = async next => {
    if (await publish(next, details)) setSelectedCategories(next);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedCategories.length && !description.trim()) return;
    if (await publish(selectedCategories, details)) onPosted?.();
  };

  return (
    <form id="community-offer-form" onSubmit={handleSubmit} className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #D35E35' }}>
      <h2 className="font-display text-xl font-bold mb-1" style={{ color: '#1A2744' }}>Share What You'd Like to Offer</h2>
      <p className="text-xs mb-5 text-muted-foreground">Selecting a topic publishes your offer immediately. Add more topics to the same offer, then save your written details below.</p>
      {saved && <p role="status" className="text-sm text-primary mb-4">Your offer is live. Topic changes are saved automatically.</p>}
      {submitting && <p role="status" className="text-sm text-muted-foreground">Saving your offer…</p>}
      {error && <p role="alert" className="text-sm text-destructive mb-4">{error}</p>}

      {/* Category multi-select */}
      <div className="mb-5">
        <label className="block text-sm font-bold mb-2" style={{ color: '#1A2744' }}>What can you offer? *</label>
        <p className="text-xs mb-3" style={{ color: '#6b5c3e' }}>Select one or more topics across categories.</p>
        <fieldset disabled={submitting} className="disabled:opacity-60">
          <CategorySearchFilters multiSelect selectedFilters={selectedCategories} onSelectFilters={selectTopics} />
        </fieldset>
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

      <label className="block text-sm text-foreground mb-4">How can you help?
        <textarea value={helpDetails} onChange={e => setHelpDetails(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm" placeholder="Describe what you can do, when you are available, and any practical details." />
      </label>
      {/* Location + Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Your Location</label>
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full bg-white rounded-xl px-4 py-3 text-sm outline-none border focus:border-primary/30"
            style={{ borderColor: '#C9A84C' }}
            placeholder="e.g. Safed, Israel"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>In person or remotely?</label>
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
        disabled={submitting || (!selectedCategories.length && !description.trim())}
        className="w-full py-3.5 font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ background: '#D35E35', color: '#fff' }}
      >
        <Send className="w-4 h-4" />
        {submitting ? 'Saving…' : saved ? 'Save Offer Details' : 'Post My Offer'}
      </button>
    </form>
  );
}