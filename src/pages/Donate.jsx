import { useState } from 'react';
import { Heart, Shield, Sparkles } from 'lucide-react';

const DONATION_OPTIONS = [
  { amount: 50, label: 'Meal', desc: 'Provide a warm meal', icon: '🍲' },
  { amount: 100, label: 'Support', desc: 'Fund urgent help', icon: '🆘' },
  { amount: 250, label: 'Sponsor', desc: 'Sponsor an event', icon: '📅' },
  { amount: 500, label: 'Champion', desc: 'Fuel ongoing programs', icon: '⭐' },
];

export default function Donate() {
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const amount = customAmount || selectedAmount;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pb-24 md:pb-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'rgba(217,93,26,0.08)' }}>
          <Heart className="w-8 h-8" style={{ color: '#D95D1A' }} />
        </div>
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: '#1A2744' }}>Support Our Circle</h1>
        <p className="text-lg leading-relaxed max-w-xl mx-auto" style={{ color: '#6b5c3e' }}>
          Your donation helps us coordinate volunteers, deliver meals, host events, and respond to urgent needs across the community.
        </p>
      </div>

      {/* Donation Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {DONATION_OPTIONS.map(({ amount: amt, label, desc, icon }) => (
          <button
            key={amt}
            onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
            className="p-4 rounded-xl border-2 transition-all text-left"
            style={{
              background: selectedAmount === amt ? '#FAF7EE' : '#fff',
              borderColor: selectedAmount === amt ? '#C9A84C' : '#e0e0e0',
            }}
          >
            <span className="text-2xl block mb-1">{icon}</span>
            <span className="block text-lg font-bold" style={{ color: '#1A2744' }}>₪{amt}</span>
            <span className="block text-xs" style={{ color: '#6b5c3e' }}>{label}</span>
            <span className="block text-[10px]" style={{ color: '#999' }}>{desc}</span>
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2" style={{ color: '#1A2744' }}>Or enter a custom amount (₪)</label>
        <input
          type="number"
          min="1"
          value={customAmount}
          onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
          placeholder="e.g. 200"
          className="w-full max-w-xs mx-auto block px-4 py-3 rounded-xl border text-center text-lg font-bold outline-none focus:border-primary/30"
          style={{ borderColor: '#C9A84C', background: '#FAF7EE', color: '#1A2744' }}
        />
      </div>

      {/* Donate CTA — directs to contact / external payment */}
      <div className="text-center">
        <a
          href="https://www.circlesofgiving.org/donate"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-all shadow-lg"
          style={{ background: '#D95D1A', color: '#fff' }}
        >
          <Heart className="w-5 h-5" /> Donate Now
        </a>
        <p className="text-xs mt-3" style={{ color: '#999' }}>
          You'll be redirected to our secure donation page
        </p>
      </div>

      {/* Trust */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-8 border-t" style={{ borderColor: '#e0e0e0' }}>
        <div className="flex gap-3">
          <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
          <div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: '#1A2744' }}>100% Goes to the Community</h3>
            <p className="text-xs" style={{ color: '#6b5c3e' }}>Every shekel supports our programs — zero admin overhead on donations.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
          <div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: '#1A2744' }}>Tax-Deductible</h3>
            <p className="text-xs" style={{ color: '#6b5c3e' }}>Circles of Giving is a registered nonprofit. Donations are eligible for tax deduction.</p>
          </div>
        </div>
      </div>
    </div>
  );
}