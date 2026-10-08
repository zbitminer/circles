import { Link } from 'react-router-dom';
import { Home, Flame, AlertTriangle, Briefcase, Calendar, UtensilsCrossed, Users, MessageSquare, BarChart3, Building2, User, Shield, HelpCircle, FileText, Heart, GraduationCap, Info, Award, LayoutGrid, Map, HandHeart, Image, LogIn, UserPlus } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Main',
    pages: [
      { icon: Home, name: 'Home', path: '/', desc: 'Welcome, ways to engage & upcoming circles' },
      { icon: Info, name: 'About', path: '/about', desc: 'Our mission, story & tributes' },
      { icon: LayoutGrid, name: 'Overview', path: '/platform', desc: 'How Circles of Giving works' },
      { icon: Image, name: 'Gallery', path: '/gallery', desc: 'Photo albums from our community' },
      { icon: Map, name: 'Site Map', path: '/sitemap', desc: 'Complete guide to all pages' },
    ],
  },
  {
    title: 'Give & Receive',
    pages: [
      { icon: Briefcase, name: 'Community Hub', path: '/opportunities', desc: 'Offer help or request support' },
      { icon: AlertTriangle, name: 'S.O.S.', path: '/sos', desc: 'Post & respond to urgent needs' },
      { icon: Heart, name: 'Health Support', path: '/health', desc: 'Medical, mental health & wellness help' },
      { icon: Building2, name: 'Corporate Volunteering', path: '/corporate', desc: 'Team volunteering programs' },
    ],
  },
  {
    title: 'Gather & Learn',
    pages: [
      { icon: Calendar, name: 'Events', path: '/events', desc: 'Discover & RSVP to events' },
      { icon: UtensilsCrossed, name: 'Hosting', path: '/shabbat', desc: 'Host or join Shabbat & holiday tables' },
      { icon: GraduationCap, name: 'Workshops', path: '/workshops', desc: 'Join or lead enrichment workshops' },
    ],
  },
  {
    title: 'Community',
    pages: [
      { icon: Flame, name: 'Community Feed', path: '/feed', desc: 'Stories, requests & updates' },
      { icon: Users, name: 'Groups', path: '/groups', desc: 'Join or create interest groups' },
      { icon: Users, name: 'Directory', path: '/directory', desc: 'Discover & follow members' },
      { icon: MessageSquare, name: 'Community Chat', path: '/chat', desc: 'Group chat with all members' },
      { icon: MessageSquare, name: 'Messages', path: '/messages', desc: 'Private conversations' },
    ],
  },
  {
    title: 'My Account',
    pages: [
      { icon: User, name: 'Profile', path: '/profile', desc: 'Your profile, hours & badges' },
      { icon: BarChart3, name: 'Impact', path: '/analytics', desc: 'Track your contributions & certificates' },
      { icon: LogIn, name: 'Login', path: '/login', desc: 'Sign in to your account' },
      { icon: UserPlus, name: 'Register', path: '/register', desc: 'Join the circle for free' },
    ],
  },
  {
    title: 'Support & Giving',
    pages: [
      { icon: HandHeart, name: 'Donate', path: '/donate', desc: 'Support our mission with a donation' },
      { icon: Award, name: 'Trust', path: '/trust', desc: 'Trust & safety in our community' },
      { icon: HelpCircle, name: 'Contact', path: '/contact', desc: 'Get in touch & FAQs' },
      { icon: FileText, name: 'Privacy Policy', path: '/privacy', desc: 'How we handle your data' },
      { icon: FileText, name: 'Terms of Use', path: '/terms', desc: 'Terms & conditions' },
    ],
  },
  {
    title: 'Administration',
    pages: [
      { icon: Shield, name: 'Moderation', path: '/moderation', desc: 'Manage community content (Moderators & Admins)' },
      { icon: Shield, name: 'Admin', path: '/admin', desc: 'Admin dashboard (Admins only)' },
    ],
  },
];

export default function Sitemap() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold mb-3 text-foreground">Site Map</h1>
        <p className="text-lg text-muted-foreground">Complete guide to all pages and features</p>
      </div>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
              <div className="w-3 h-3 rounded-full bg-primary" />
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.pages.map(({ icon: Icon, name, path, desc }) => (
                <Link
                  key={path}
                  to={path}
                  className="group p-5 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-1 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{name}</h3>
                      <p className="text-xs mt-1 text-muted-foreground">{desc}</p>
                      <span className="text-xs mt-2 inline-block px-2 py-1 rounded-full bg-primary/10 text-primary">{path}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 p-6 rounded-2xl bg-secondary border border-border">
        <h3 className="font-semibold mb-4 text-foreground">Access Levels</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold text-foreground">🌐 Public</span>
            <p className="text-muted-foreground">Anyone can browse (Home, About, Events, Hosting, Workshops, Community Hub, Feed, Gallery, Donate, Contact)</p>
          </div>
          <div>
            <span className="font-semibold text-foreground">👤 Members</span>
            <p className="text-muted-foreground">Logged-in users only (Profile, Messages, Community Chat, Impact)</p>
          </div>
          <div>
            <span className="font-semibold text-foreground">🛡️ Admin/Mod</span>
            <p className="text-muted-foreground">Moderation and Admin dashboard (restricted)</p>
          </div>
        </div>
      </div>
    </div>
  );
}