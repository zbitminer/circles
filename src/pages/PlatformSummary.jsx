import { useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const stats = [
  { value: '347+', label: 'Active Members' },
  { value: '6', label: 'Cause Categories' },
  { value: '4', label: 'Core Pillars' },
  { value: '15+', label: 'Platform Features' },
];

const pillars = [
  {
    emoji: '🤝',
    label: 'Core Social Interaction',
    description: 'Connect, converse, and build relationships within the community.',
    features: [
      { label: 'Community Feed', desc: 'Share updates, stories, and celebrate wins together.' },
      { label: 'Messages', desc: 'Private one-on-one conversations between members.' },
      { label: 'Volunteer Profile', desc: 'Your identity, impact stats, badges, and hour logs.' },
      { label: 'Member Directory', desc: 'Discover fellow volunteers, filter by cause and location.' },
    ],
  },
  {
    emoji: '🌱',
    label: 'Community Operations & Support',
    description: 'The heart of giving — find opportunities, attend events, and respond to urgent needs.',
    features: [
      { label: 'SOS Board', desc: 'Urgent requests for immediate help within 24–48 hours.' },
      { label: 'Shabbat Meals', desc: 'Host or join a Shabbat table and build connection.' },
      { label: 'Volunteer Events', desc: 'Discover and RSVP to local and virtual community events.' },
      { label: 'Opportunities', desc: 'Browse giving opportunities and express interest.' },
    ],
  },
  {
    emoji: '⚙️',
    label: 'Governance & Management',
    description: 'Tools for transparency, safety, accountability, and organizational health.',
    features: [
      { label: 'Admin & Moderation', desc: 'Manage content, users, and community standards.' },
      { label: 'Trust & Safety', desc: 'Our commitments to privacy, verification, and wellbeing.' },
      { label: 'Analytics & Impact', desc: 'Track volunteer hours, events, and community metrics.' },
      { label: 'Corporate Volunteering', desc: 'Team-building programs and corporate partnerships.' },
    ],
  },
  {
    emoji: '🏛️',
    label: 'Foundational & Administrative',
    description: 'The infrastructure that keeps everything running safely and accessibly.',
    features: [
      { label: 'Account Access', desc: 'Secure registration, login, and identity management.' },
      { label: 'Compliance', desc: 'Privacy policy and terms of use for member protection.' },
      { label: 'Donate', desc: 'Support our mission and help us grow the circle.' },
      { label: 'About & Contact', desc: 'Our story, mission, and how to reach the team.' },
    ],
  },
];

const capabilities = [
  { title: 'Community Connection', items: [
    'Community Feed for stories, updates, and shared wins',
    'Private messaging between members',
    'Member directory with cause and location filtering',
    'Volunteer profiles with impact stats, badges, and hour logs',
  ]},
  { title: 'Giving & Support', items: [
    'Opportunities board to browse and express interest',
    'SOS Board for urgent 24–48 hour response requests',
    'Shabbat Meals hosting and joining',
    'Volunteer Events with RSVP, calendar, and map views',
  ]},
  { title: 'Workshops & Learning', items: [
    'Workshop inquiry system for participation and leadership',
    'Category-based discovery (Arts, Wellness, Music, Cooking, and more)',
    'In-person, Zoom, and hybrid formats',
    'Accessibility options support',
  ]},
  { title: 'Governance & Safety', items: [
    'Admin panel for content, events, workshops, hours, and gallery',
    'Moderation tools for community standards',
    'Trust & Safety commitments with privacy and verification',
    'Role-based access (admin, moderator, user)',
  ]},
  { title: 'Impact & Analytics', items: [
    'Volunteer hour logging and approval workflow',
    'Event attendance tracking',
    'Impact dashboards with monthly charts',
    'Badge system recognizing milestones',
  ]},
  { title: 'Accessibility & Inclusion', items: [
    'Bilingual support (English / Hebrew) with full RTL layout',
    'Accessibility options across events and workshops',
    'Mobile-first responsive design optimized for Android WebView',
    'Accessibility widget (contrast, spacing, animations)',
  ]},
];

export default function PlatformSummary() {
  const { localize } = useLanguage();
  const docRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!docRef.current || downloading) return;
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(docRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('Circles-of-Giving-Platform-Summary.pdf');
    } catch (err) {
      console.error(err);
      alert('Could not generate the PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return localize(
    <div className="min-h-screen bg-background">
      {/* Sticky download bar */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">Circles of Giving — Platform Summary</h1>
            <p className="text-xs text-muted-foreground">Prepared for client review</p>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow disabled:opacity-60"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? 'Generating…' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Document */}
      <div ref={docRef} className="max-w-4xl mx-auto px-6 py-10 bg-white text-[#141414]">
        {/* Header */}
        <div className="border-b-2 border-[#bd4c0f] pb-6 mb-8">
          <h1 className="text-3xl font-extrabold mb-2">Circles of Giving — Platform Summary</h1>
          <p className="text-sm text-gray-500">Prepared for: Client Review · November 2026</p>
          <p className="text-sm text-gray-500">Live URL: https://circlesofgivingplatform.base44.app</p>
        </div>

        {/* Overview */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">1. Overview</h2>
          <p className="text-sm leading-relaxed mb-4 text-gray-700">
            Circles of Giving (COG) is a community ecosystem based in Safed, Israel, built on a single, powerful idea: <strong>give what you can, receive what you need.</strong> It is both a virtual platform and a physical community center, designed so that neighbors can help neighbors — sharing time, talent, and support without transaction, obligation, or judgment.
          </p>
          <p className="text-sm leading-relaxed mb-3 text-gray-700">The platform is organized around four interconnected pillars:</p>
          <table className="w-full text-sm border border-gray-200 mb-2">
            <thead>
              <tr className="bg-[#fcfaf8]">
                <th className="text-left font-bold p-2 border-b border-gray-200">Pillar</th>
                <th className="text-left font-bold p-2 border-b border-gray-200">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {pillars.map((p) => (
                <tr key={p.label} className="border-b border-gray-100">
                  <td className="p-2 font-semibold align-top">{p.label}</td>
                  <td className="p-2 text-gray-700">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Pillars */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">2. The Four Pillars & Their Features</h2>
          <div className="space-y-5">
            {pillars.map((p, idx) => (
              <div key={p.label} className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-[#fcfaf8] px-4 py-3 border-b border-gray-200">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#bd4c0f] mb-0.5">Pillar {idx + 1}</p>
                  <h3 className="text-base font-extrabold">{p.emoji} {p.label}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {p.features.map((f) => (
                      <tr key={f.label} className="border-b border-gray-100 last:border-b-0">
                        <td className="p-2.5 font-semibold align-top w-1/3">{f.label}</td>
                        <td className="p-2.5 text-gray-700">{f.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">3. Key Platform Capabilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {capabilities.map((c) => (
              <div key={c.title} className="rounded-xl border border-gray-200 p-4">
                <h3 className="text-sm font-bold mb-2 text-[#bd4c0f]">{c.title}</h3>
                <ul className="text-sm space-y-1.5 text-gray-700">
                  {c.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[#bd4c0f] flex-shrink-0">•</span>
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Technology */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">4. Technology Highlights</h2>
          <ul className="text-sm space-y-1.5 text-gray-700">
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Responsive web platform — works across desktop, tablet, and mobile</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Bilingual — full English and Hebrew localization with RTL support</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Mobile-optimized for Android WebView deployment</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Real-time updates — live community activity, RSVPs, and notifications</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Automated notifications — Slack integration for new events and opportunities</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> AI-assisted features — opportunity matching and request filing assistants</li>
            <li className="flex gap-2"><span className="text-[#bd4c0f]">•</span> Secure infrastructure — row-level security, role-based permissions, and moderation</li>
          </ul>
        </section>

        {/* Circle Model */}
        <section className="mb-8 rounded-xl bg-[#141414] text-white p-6">
          <h2 className="text-lg font-bold mb-2 text-[#bd4c0f]">5. The Circle Model</h2>
          <p className="text-lg font-extrabold mb-3">I Give. I Receive. I Belong.</p>
          <p className="text-sm leading-relaxed text-white/80">
            Every feature is designed around one idea: community flourishes when people freely give what they have and openly receive what they need — without transaction, without obligation, without judgment.
          </p>
        </section>

        {/* At a Glance */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">6. At a Glance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-extrabold text-[#bd4c0f]">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Cause Categories */}
        <section className="mb-2">
          <h2 className="text-xl font-bold mb-3">7. Cause Categories</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Companionship · Food · Home · Skill Sharing · Technology · Transportation · Creative Workshops · Consultants · Wellness · Other
          </p>
        </section>

        {/* Footer */}
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-xs text-gray-400">
          For a live walkthrough, visit: https://circlesofgivingplatform.base44.app
        </div>
      </div>
    </div>
  );
}