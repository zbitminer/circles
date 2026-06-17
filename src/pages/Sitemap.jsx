import { Home, Flame, AlertTriangle, Briefcase, Calendar, UtensilsCrossed, Users, MessageSquare, BarChart3, Building2, User, Shield, HelpCircle, Lock, FileText, Heart } from 'lucide-react';

export default function Sitemap() {
  const sections = [
    {
      title: 'Main Hub',
      color: '#1A2744',
      pages: [
        { icon: Home, name: 'Home', path: '/', desc: 'Landing page & platform overview' },
      ],
    },
    {
      title: 'Volunteering',
      color: '#2d7a3a',
      pages: [
        { icon: Briefcase, name: 'Opportunities', path: '/opportunities', desc: 'Browse & apply for volunteer roles' },
        { icon: Calendar, name: 'Events', path: '/events', desc: 'Discover & RSVP to volunteer events' },
        { icon: AlertTriangle, name: 'SOS Board', path: '/sos', desc: 'Post & respond to urgent needs' },
        { icon: Heart, name: 'Health Support', path: '/health', desc: 'Medical, mental health & wellness help' },
      ],
    },
    {
      title: 'Community',
      color: '#8a6a10',
      pages: [
        { icon: Flame, name: 'Feed', path: '/feed', desc: 'Community stories & updates' },
        { icon: UtensilsCrossed, name: 'Shabbat Meals', path: '/shabbat', desc: 'Host & join community meals' },
        { icon: Users, name: 'Directory', path: '/directory', desc: 'Discover & follow volunteers' },
        { icon: MessageSquare, name: 'Messages', path: '/messages', desc: 'Direct messaging with members' },
      ],
    },
    {
      title: 'Personal',
      color: '#7c5cbf',
      pages: [
        { icon: User, name: 'Profile', path: '/profile', desc: 'Your volunteer profile & hours' },
        { icon: BarChart3, name: 'Impact', path: '/analytics', desc: 'Track your contributions & certificates' },
      ],
    },
    {
      title: 'Organization',
      color: '#c0392b',
      pages: [
        { icon: Building2, name: 'Corporate', path: '/corporate', desc: 'Team volunteering programs' },
        { icon: Shield, name: 'Moderation', path: '/moderation', desc: 'Manage platform content (Mod+)' },
        { icon: Shield, name: 'Admin', path: '/admin', desc: 'Community dashboard (Admin only)' },
      ],
    },
    {
      title: 'Support',
      color: '#555',
      pages: [
        { icon: HelpCircle, name: 'Contact', path: '/contact', desc: 'Get in touch & FAQs' },
        { icon: FileText, name: 'Privacy', path: '/privacy', desc: 'Privacy policy' },
        { icon: FileText, name: 'Terms', path: '/terms', desc: 'Terms of use' },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold mb-3" style={{ color: '#1A2744' }}>Site Map</h1>
        <p className="text-lg" style={{ color: '#6b5c3e' }}>Complete guide to all pages and features</p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: section.color }}>
              <div className="w-3 h-3 rounded-full" style={{ background: section.color }} />
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.pages.map(({ icon: Icon, name, path, desc }) => (
                <a
                  key={path}
                  href={path}
                  className="group p-5 rounded-2xl hover:shadow-lg transition-all"
                  style={{
                    background: '#FAF7EE',
                    border: '1.5px solid #C9A84C',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" style={{ color: section.color }} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold group-hover:opacity-75 transition-opacity" style={{ color: '#1A2744' }}>
                        {name}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: '#6b5c3e' }}>
                        {desc}
                      </p>
                      <span className="text-xs mt-2 inline-block px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {path}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-16 p-6 rounded-2xl" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
        <h3 className="font-semibold mb-4" style={{ color: '#1A2744' }}>Access Levels</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold" style={{ color: '#1A2744' }}>🌐 Public</span>
            <p style={{ color: '#6b5c3e' }}>Anyone can access (Home, Contact, Privacy, Terms)</p>
          </div>
          <div>
            <span className="font-semibold" style={{ color: '#1A2744' }}>👤 Members</span>
            <p style={{ color: '#6b5c3e' }}>Logged-in users only (most pages)</p>
          </div>
          <div>
            <span className="font-semibold" style={{ color: '#1A2744' }}>🛡️ Admin/Mod</span>
            <p style={{ color: '#6b5c3e' }}>Moderation, Admin dashboard (restricted)</p>
          </div>
        </div>
      </div>
    </div>
  );
}