import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, GraduationCap, Heart } from 'lucide-react';
import ParticipateForm from '@/components/workshops/ParticipateForm';
import LeadForm from '@/components/workshops/LeadForm';
import WorkshopListings from '@/components/workshops/WorkshopListings';

export default function Workshops() {
  const [tab, setTab] = useState('list');
  const [created, setCreated] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden mb-8 relative" style={{ border: '2px solid hsl(var(--primary))' }}>
        <img src="https://images.unsplash.com/photo-1522202176986-ec32a4399979?w=800&h=400&fit=crop" alt="Community learning" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(20,20,20,0.94), rgba(20,20,20,0.82))' }} />
        <div className="relative px-6 py-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid hsl(var(--primary))' }}>
            <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
            <span className="text-xs font-semibold" style={{ color: 'hsl(var(--palette-50))' }}>Education & Enrichment</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-3" style={{ color: 'hsl(var(--palette-50))' }}>Workshops</h1>
          <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(245,230,192,0.85)' }}>
            Did you know that each of us holds a treasure of knowledge and unique talents? We believe everyone can be both an enthusiastic learner and an inspiring teacher or mentor. This is a wonderful opportunity to explore new interests, deepen your knowledge, and share your unique expertise with others.
          </p>
          <p className="text-sm mt-3 italic" style={{ color: 'rgba(245,230,192,0.7)' }}>
            Imagine a community where every member contributes their knowledge while learning from the wisdom of others — this is the essence of Circles of Giving.
          </p>
        </div>
      </div>

      {/* Tabs */}
      {created && <p role="status" className="mb-4 rounded-xl bg-secondary p-4 text-secondary-foreground">Workshop created. Your details, map, and printable flyer are available below.</p>}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setTab('list')} className={`flex-1 min-w-36 rounded-xl border border-border px-4 py-3 text-sm font-semibold ${tab === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}`}>Browse Workshops</button>
        <button
          onClick={() => setTab('participate')}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
          style={tab === 'participate'
            ? { background: 'hsl(var(--palette-950))', color: 'hsl(var(--palette-50))', border: '1.5px solid hsl(var(--primary))' }
            : { background: 'hsl(var(--card))', color: 'hsl(var(--muted-foreground))', border: '1.5px solid hsl(var(--primary))' }}
        >
          <GraduationCap className="w-4 h-4" /> I want to participate
        </button>
        <button
          onClick={() => setTab('lead')}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
          style={tab === 'lead'
            ? { background: 'hsl(var(--palette-950))', color: 'hsl(var(--palette-50))', border: '1.5px solid hsl(var(--primary))' }
            : { background: 'hsl(var(--card))', color: 'hsl(var(--muted-foreground))', border: '1.5px solid hsl(var(--primary))' }}
        >
          <Heart className="w-4 h-4" /> Create Workshop
        </button>
      </div>

      {/* Form card */}
      {tab !== 'list' && <div className="rounded-2xl p-6" style={{ background: 'hsl(var(--card))', border: '1.5px solid hsl(var(--primary))' }}>
        <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'hsl(var(--palette-950))' }}>
          {tab === 'participate' ? 'Share your workshop interests' : 'Create a workshop'}
        </h2>
        <p className="text-xs mb-5" style={{ color: 'hsl(var(--muted-foreground))' }}>
          {tab === 'participate' ? 'Tell us what you\'d love to learn — we\'ll match you when a group forms.' : 'Share your knowledge with the community as a workshop leader.'}
        </p>
        {tab === 'participate' ? <ParticipateForm /> : <LeadForm onCreated={() => { setCreated(true); setTab('list'); }} />}
      </div>}

      {/* Sample / live workshop listings */}
      <div className="mt-10">
        <WorkshopListings />
      </div>

      <p className="text-center text-xs mt-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
        By submitting you confirm you have read our <Link to="/terms" className="font-semibold" style={{ color: 'hsl(var(--primary))' }}>Terms</Link> and <Link to="/privacy" className="font-semibold" style={{ color: 'hsl(var(--primary))' }}>Privacy Policy</Link>.
      </p>
    </div>
  );
}