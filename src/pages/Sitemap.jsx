import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Flame, AlertTriangle, Briefcase, Calendar, UtensilsCrossed, Users, MessageSquare, BarChart3, Building2, User, Shield, HelpCircle, FileText, Heart, GraduationCap, Info, Award, LayoutGrid, Map, HandHeart, Image, LogIn, UserPlus, KeyRound, Search } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const SECTIONS = [
  {
    title: 'Main',
    pages: [
      { icon: Home, name: 'Home', path: '/', access: 'Public', desc: 'Welcome, ways to engage & upcoming circles in Safed, Israel' },
      { icon: Info, name: 'About', path: '/about', access: 'Public', desc: 'Our mission, story & tributes' },
      { icon: LayoutGrid, name: 'Overview', path: '/platform', access: 'Public', desc: 'How Circles of Giving works' },
      { icon: Image, name: 'Gallery', path: '/gallery', access: 'Public', desc: 'Photo albums from our community' },
      { icon: Map, name: 'Site Map', path: '/sitemap', access: 'Public', desc: 'Complete directory of all pages & features' },
    ],
  },
  {
    title: 'Give & Receive',
    pages: [
      { icon: Briefcase, name: 'Community Hub', path: '/opportunities', access: 'Public', desc: 'Offer help or request support across categories' },
      { icon: AlertTriangle, name: 'S.O.S.', path: '/sos', access: 'Public', desc: 'Post & respond to urgent 24–48h community needs' },
      { icon: Heart, name: 'Health Support', path: '/health', access: 'Public', desc: 'Medical, mental health & wellness support' },
      { icon: Building2, name: 'Corporate Volunteering', path: '/corporate', access: 'Public', desc: 'Team volunteering programs & inquiries' },
    ],
  },
  {
    title: 'Gather & Learn',
    pages: [
      { icon: Calendar, name: 'Events', path: '/events', access: 'Public', desc: 'Discover, create & RSVP to community events' },
      { icon: UtensilsCrossed, name: 'Shabbat & Holiday Meals', path: '/shabbat', access: 'Public', desc: 'Host or join Shabbat & holiday tables' },
      { icon: GraduationCap, name: 'Workshops', path: '/workshops', access: 'Public', desc: 'Join or lead enrichment workshops' },
    ],
  },
  {
    title: 'Community',
    pages: [
      { icon: Flame, name: 'Community Feed', path: '/feed', access: 'Public', desc: 'Stories, requests, photos & updates' },
      { icon: Users, name: 'Groups', path: '/groups', access: 'Public', desc: 'Join or create interest groups' },
      { icon: Users, name: 'Directory', path: '/directory', access: 'Public', desc: 'Browse & connect with community members' },
      { icon: MessageSquare, name: 'Community Chat', path: '/chat', access: 'Members', desc: 'Live group chat with community members' },
      { icon: MessageSquare, name: 'Messages', path: '/messages', access: 'Members', desc: 'Direct private conversations' },
    ],
  },
  {
    title: 'My Account',
    pages: [
      { icon: User, name: 'Profile & My Calendar', path: '/profile', access: 'Members', desc: 'Your profile, RSVP calendar, logged hours, badges & privacy' },
      { icon: BarChart3, name: 'Impact & Certificates', path: '/analytics', access: 'Members', desc: 'Track your contributions & download certificates' },
      { icon: LogIn, name: 'Login', path: '/login', access: 'Public', desc: 'Sign in to your account' },
      { icon: UserPlus, name: 'Register', path: '/register', access: 'Public', desc: 'Join the circle for free' },
      { icon: KeyRound, name: 'Forgot Password', path: '/forgot-password', access: 'Public', desc: 'Reset your account password' },
    ],
  },
  {
    title: 'Support & Giving',
    pages: [
      { icon: HandHeart, name: 'Donate', path: '/donate', access: 'Public', desc: 'Support our mission with a one-time or monthly donation' },
      { icon: Award, name: 'Trust & Safety', path: '/trust', access: 'Public', desc: 'Community guidelines, verification & safety' },
      { icon: HelpCircle, name: 'Contact', path: '/contact', access: 'Public', desc: 'Get in touch & FAQs' },
      { icon: FileText, name: 'Privacy Policy', path: '/privacy', access: 'Public', desc: 'How we protect and handle your data' },
      { icon: FileText, name: 'Terms of Use', path: '/terms', access: 'Public', desc: 'Community terms & conditions' },
    ],
  },
  {
    title: 'Administration',
    pages: [
      { icon: Shield, name: 'Moderation', path: '/moderation', access: 'Admin/Mod', desc: 'Review reported content (Moderators & Admins)' },
      { icon: Shield, name: 'Admin Dashboard', path: '/admin', access: 'Admin', desc: 'Manage members, events, workshops, hours & content' },
    ],
  },
];

export default function Sitemap() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const filteredSections = SECTIONS.map((section) => ({
    ...section,
    pages: section.pages.filter(
      (p) =>
        !query.trim() ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.desc.toLowerCase().includes(query.toLowerCase()) ||
        p.path.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((section) => section.pages.length > 0);

  const totalPages = SECTIONS.reduce((acc, s) => acc + s.pages.length, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 text-foreground">{t('Site Map')}</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          {t('Complete guide to all pages and features')} ({totalPages} {t('pages')})
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pages or routes..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-8">
        {filteredSections.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              {t(section.title)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {section.pages.map(({ icon: Icon, name, path, desc, access }) => (
                <Link
                  key={path}
                  to={path}
                  className="group p-4 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm text-foreground truncate">{t(name)}</h3>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground flex-shrink-0">
                          {access}
                        </span>
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground">{t(desc)}</p>
                      <span className="text-[11px] mt-2 inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                        {path}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-secondary border border-border">
        <h3 className="font-semibold mb-4 text-foreground">{t('Access Levels')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold text-foreground">🌐 {t('Public')}</span>
            <p className="text-muted-foreground text-xs mt-1">
              Anyone can browse (Home, About, Overview, Events, Shabbat Meals, Workshops, Community Hub, S.O.S., Health, Feed, Groups, Directory, Gallery, Donate, Trust, Contact)
            </p>
          </div>
          <div>
            <span className="font-semibold text-foreground">👤 {t('Members')}</span>
            <p className="text-muted-foreground text-xs mt-1">
              Signed-in members (Profile & Calendar, Messages, Community Chat, Impact & Certificates)
            </p>
          </div>
          <div>
            <span className="font-semibold text-foreground">🛡️ {t('Admin/Mod')}</span>
            <p className="text-muted-foreground text-xs mt-1">
              Moderation and Admin Dashboard (restricted by role)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}