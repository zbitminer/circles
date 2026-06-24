import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, GraduationCap, Heart } from 'lucide-react';
import ParticipateForm from '@/components/workshops/ParticipateForm';
import LeadForm from '@/components/workshops/LeadForm';

export default function Workshops() {
  const [tab, setTab] = useState('participate');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden mb-8" style={{ background: 'linear-gradient(135deg, #1A2744, #2d4070)', border: '2px solid #C9A84C' }}>
        <div className="px-6 py-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid #C9A84C' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#C9A84C' }} />
            <span className="text-xs font-semibold" style={{ color: '#F5E6C0' }}>Education & Enrichment</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-3" style={{ color: '#F5E6C0' }}>Workshops</h1>
          <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(245,230,192,0.85)' }}>
            Did you know that each of us holds a treasure of knowledge and unique talents? We believe everyone can be both an enthusiastic learner and an inspiring teacher or mentor. This is a wonderful opportunity to explore new interests, deepen your knowledge, and share your unique expertise with others.
          </p>
          <p className="text-sm mt-3 italic" style={{ color: 'rgba(245,230,192,0.7)' }}>
            Imagine a community where every member contributes their knowledge while learning from the wisdom of others — this is the essence of Circles of Giving.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('participate')}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
          style={tab === 'participate'
            ? { background: '#1A2744', color: '#F5E6C0', border: '1.5px solid #C9A84C' }
            : { background: '#FAF7EE', color: '#6b5c3e', border: '1.5px solid #C9A84C' }}
        >
          <GraduationCap className="w-4 h-4" /> I want to participate
        </button>
        <button
          onClick={() => setTab('lead')}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
          style={tab === 'lead'
            ? { background: '#1A2744', color: '#F5E6C0', border: '1.5px solid #C9A84C' }
            : { background: '#FAF7EE', color: '#6b5c3e', border: '1.5px solid #C9A84C' }}
        >
          <Heart className="w-4 h-4" /> I want to lead
        </button>
      </div>

      {/* Form card */}
      <div className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <h2 className="font-display text-xl font-bold mb-1" style={{ color: '#1A2744' }}>
          {tab === 'participate' ? 'Sign up for a workshop' : 'Offer to lead a workshop'}
        </h2>
        <p className="text-xs mb-5" style={{ color: '#6b5c3e' }}>
          {tab === 'participate' ? 'Tell us what you\'d love to learn — we\'ll match you when a group forms.' : 'Share your knowledge with the community as a workshop leader.'}
        </p>
        {tab === 'participate' ? <ParticipateForm /> : <LeadForm />}
      </div>

      <p className="text-center text-xs mt-6" style={{ color: '#6b5c3e' }}>
        By submitting you confirm you have read our <Link to="/terms" className="font-semibold" style={{ color: '#C9A84C' }}>Terms</Link> and <Link to="/privacy" className="font-semibold" style={{ color: '#C9A84C' }}>Privacy Policy</Link>.
      </p>
    </div>
  );
}