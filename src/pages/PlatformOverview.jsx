import { Link } from 'react-router-dom';
import { MessageSquare, User, Search, AlertCircle, Utensils, Calendar, Briefcase, Shield, BarChart2, Building2, LogIn, FileText, HelpCircle, Heart, Rss, Globe } from 'lucide-react';

const categories = [
  {
    id: 'social',
    label: 'Core Social Interaction',
    color: '#0891b2',
    bg: 'rgba(8,145,178,0.07)',
    border: 'rgba(8,145,178,0.25)',
    badge: 'rgba(8,145,178,0.12)',
    emoji: '🤝',
    description: 'Connect, converse, and build relationships within the community.',
    features: [
      { icon: Rss, label: 'Community Feed', desc: 'Share updates, stories, and celebrate wins together.', path: '/feed' },
      { icon: MessageSquare, label: 'Messages', desc: 'Private one-on-one conversations between members.', path: '/messages' },
      { icon: User, label: 'Volunteer Profile', desc: 'Your identity, impact stats, badges, and hour logs.', path: '/profile' },
      { icon: Search, label: 'Member Directory', desc: 'Discover fellow volunteers, filter by cause and location.', path: '/directory' },
    ],
  },
  {
    id: 'operations',
    label: 'Community Operations & Support',
    color: '#16a34a',
    bg: 'rgba(22,163,74,0.07)',
    border: 'rgba(22,163,74,0.25)',
    badge: 'rgba(22,163,74,0.12)',
    emoji: '🌱',
    description: 'The heart of giving — find opportunities, attend events, and respond to urgent needs.',
    features: [
      { icon: AlertCircle, label: 'SOS Board', desc: 'Urgent requests for immediate help within 24–48 hours.', path: '/sos' },
      { icon: Utensils, label: 'Shabbat Meals', desc: 'Host or join a Shabbat table and build connection.', path: '/shabbat' },
      { icon: Calendar, label: 'Volunteer Events', desc: 'Discover and RSVP to local and virtual community events.', path: '/events' },
      { icon: Briefcase, label: 'Opportunities', desc: 'Browse giving opportunities and express interest.', path: '/opportunities' },
    ],
  },
  {
    id: 'governance',
    label: 'Governance & Management',
    color: '#d97706',
    bg: 'rgba(217,119,6,0.07)',
    border: 'rgba(217,119,6,0.25)',
    badge: 'rgba(217,119,6,0.12)',
    emoji: '⚙️',
    description: 'Tools for transparency, safety, accountability, and organizational health.',
    features: [
      { icon: Shield, label: 'Admin & Moderation', desc: 'Manage content, users, and community standards.', path: '/admin' },
      { icon: Shield, label: 'Trust & Safety', desc: 'Our commitments to privacy, verification, and wellbeing.', path: '/trust' },
      { icon: BarChart2, label: 'Analytics & Impact', desc: 'Track volunteer hours, events, and community metrics.', path: '/analytics' },
      { icon: Building2, label: 'Corporate Volunteering', desc: 'Team-building programs and corporate partnerships.', path: '/corporate' },
    ],
  },
  {
    id: 'foundational',
    label: 'Foundational & Administrative',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.07)',
    border: 'rgba(124,58,237,0.25)',
    badge: 'rgba(124,58,237,0.12)',
    emoji: '🏛️',
    description: 'The infrastructure that keeps everything running safely and accessibly.',
    features: [
      { icon: LogIn, label: 'Account Access', desc: 'Secure registration, login, and identity management.', path: '/register' },
      { icon: FileText, label: 'Compliance', desc: 'Privacy policy and terms of use for member protection.', path: '/privacy' },
      { icon: Heart, label: 'Donate', desc: 'Support our mission and help us grow the circle.', path: '/donate' },
      { icon: Globe, label: 'About & Contact', desc: 'Our story, mission, and how to reach the team.', path: '/about' },
    ],
  },
];

const stats = [
  { value: '347+', label: 'Active Members' },
  { value: '6', label: 'Cause Categories' },
  { value: '4', label: 'Core Pillars' },
  { value: '15+', label: 'Platform Features' },
];

export default function PlatformOverview() {
  return (
    <div className="pb-24 md:pb-0">

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2a1f3d 100%)', borderBottom: '3px solid #D95D1A' }}>
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-widest" style={{ background: 'rgba(217,93,26,0.15)', color: '#D95D1A', border: '1px solid rgba(217,93,26,0.3)' }}>
            Platform Overview
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5" style={{ color: '#fff' }}>
            A Comprehensive<br />
            <span style={{ color: '#D95D1A' }}>Community Ecosystem</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Circles of Giving is built on four interconnected pillars — social connection, community support, governance, and foundational infrastructure — all working together to power a giving community.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map(({ value, label }) => (
              <div key={label} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-2xl font-extrabold mb-1" style={{ color: '#D95D1A' }}>{value}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] block mb-2" style={{ color: '#D95D1A' }}>The Four Pillars</span>
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: '#1A1A1A' }}>Everything You Need in One Platform</h2>
        </div>

        <div className="space-y-12">
          {categories.map((cat, idx) => (
            <div key={cat.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-start ${idx % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
              {/* Category Header */}
              <div className={`lg:col-span-4 rounded-2xl p-6 ${idx % 2 === 1 ? 'lg:col-start-9' : ''}`} style={{ background: cat.bg, border: `1.5px solid ${cat.border}` }}>
                <div className="text-3xl mb-3">{cat.emoji}</div>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: cat.color }}>Pillar {idx + 1}</div>
                <h3 className="text-xl font-extrabold mb-3" style={{ color: '#1A1A1A' }}>{cat.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{cat.description}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold" style={{ color: cat.color }}>
                  {cat.features.length} features →
                </div>
              </div>

              {/* Feature Cards */}
              <div className={`lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 ${idx % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                {cat.features.map(({ icon: Icon, label, desc, path }) => (
                  <Link key={label} to={path}
                    className="group flex items-start gap-4 p-4 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5"
                    style={{ background: '#fff', border: '1.5px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cat.bg }}>
                      <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-1 group-hover:underline" style={{ color: '#1A1A1A' }}>{label}</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#666' }}>{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it all connects */}
      <section style={{ background: '#F9F9F9', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] block mb-3" style={{ color: '#D95D1A' }}>The Circle Model</span>
          <h2 className="text-2xl font-extrabold mb-4" style={{ color: '#1A1A1A' }}>I Give. I Receive. I Belong. I Grow.</h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: '#555' }}>
            Every feature on this platform is designed around one idea: that community flourishes when people freely give what they have and openly receive what they need — without transaction, without obligation, without judgment.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 font-bold px-10 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg" style={{ background: '#D95D1A', color: '#fff' }}>
            Join the Circle — Free →
          </Link>
        </div>
      </section>

    </div>
  );
}