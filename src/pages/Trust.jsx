import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Users, Heart, Eye, FileCheck, ArrowRight, Clock } from 'lucide-react';

export default function Trust() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Verified Community',
      desc: 'Every member joins through a secure registration process. Hosts, volunteers, and those seeking help are part of an accountable, real community of neighbors.',
    },
    {
      icon: Lock,
      title: 'Privacy & Confidentiality',
      desc: 'Requests for help are handled with discretion. Your personal information is never sold or shared, and sensitive requests remain confidential.',
    },
    {
      icon: Eye,
      title: 'Active Moderation',
      desc: 'Our moderators review community posts and flagged content to keep every circle respectful, safe, and welcoming for all.',
    },
    {
      icon: FileCheck,
      title: 'Transparent Stewardship',
      desc: 'We honor every contribution as a sacred trust, dedicating our resources to the frontline of need where they can do the most good.',
    },
    {
      icon: Heart,
      title: 'Care, Not Profit',
      desc: 'Circles of Giving is a community initiative. All meal connections, support requests, and mutual aid are provided free of charge.',
    },
    {
      icon: Users,
      title: 'Peer Accountability',
      desc: 'Reviews and ratings help build a track record of trust between hosts and guests, volunteers and recipients—so you always know who you\'re connecting with.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
      {/* Joined this week bar */}
      <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
        <div className="flex -space-x-2">
          {['R', 'E', 'S', 'M', 'Y'].map((letter, i) => (
            <div key={i} className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: ['#3498DB', '#E74C3C', '#2ECC71', '#9B59B6', '#E67E22'][i], border: '2px solid #fff' }}>
              {letter}
            </div>
          ))}
        </div>
        <span className="text-sm" style={{ color: '#6b5c3e' }}>
          Joined this week: <strong>Rivka, Eitan, Shira</strong> + 12 more
        </span>
      </div>

      {/* A space you can trust */}
      <div className="mb-14">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-8" style={{ color: '#2C3E50', fontFamily: 'Georgia, serif' }}>
          A space you can trust
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {[
            { icon: ShieldCheck, title: 'Verified Members', desc: 'Every member joins through trusted community referral — no anonymous strangers.' },
            { icon: Users, title: 'Real People Only', desc: 'No bots, no algorithms. Only genuine human beings who show up for each other.' },
            { icon: Heart, title: 'Values-Driven', desc: 'Built on Tzedakah, Chesed, and Tikkun Olam — ancient values for modern community.' },
            { icon: Clock, title: 'Always Free', desc: 'Circles will always be free to join. Giving and receiving should never have a price tag.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl" style={{ background: '#fbfaf7', border: '1px solid #e0e0e0' }}>
              <Icon className="w-6 h-6 mb-3" style={{ color: '#E67E22' }} />
              <h3 className="font-bold text-base mb-2" style={{ color: '#2C3E50' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="rounded-2xl py-10 px-6 text-center" style={{ background: '#E67E22' }}>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2" style={{ color: '#fff', fontFamily: 'Georgia, serif' }}>
            Your circle is waiting.
          </h2>
          <p className="text-sm md:text-base mb-6" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Register free in 2 minutes. Start giving. Start receiving. Belong.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity" style={{ background: '#fff', color: '#E67E22' }}>
            Join the Circle — Register Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{ background: '#1A2744' }}>
          <ShieldCheck className="w-8 h-8" style={{ color: '#C9A84C' }} />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3" style={{ color: '#1A2744' }}>
          Trust & Safety
        </h1>
        <p className="mt-3 text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#6b5c3e' }}>
          Trust is the foundation of every circle. We are committed to keeping our community safe, confidential,
          and accountable—so that giving and receiving help always feels secure.
        </p>
      </div>

      {/* Trust Cards + Standards Banner */}
      <div className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {[
            { icon: Eye, title: 'Active Moderation', desc: 'Our moderators review community posts and flagged content to keep every circle respectful, safe, and welcoming for all.' },
            { icon: FileCheck, title: 'Transparent Stewardship', desc: 'We honor every contribution as a sacred trust, dedicating our resources to the frontline of need where they can do the most good.' },
            { icon: Heart, title: 'Care, Not Profit', desc: 'Circles of Giving is a community initiative. All meal connections, support requests, and mutual aid are provided free of charge.' },
            { icon: Users, title: 'Peer Accountability', desc: 'Reviews and ratings help build a track record of trust between hosts and guests, volunteers and recipients—so you always know who you\'re connecting with.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl" style={{ background: '#fff', border: '1px solid #e0e0e0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Icon className="w-5 h-5 mb-3" style={{ color: '#C9A84C' }} />
              <h3 className="font-bold text-base mb-2" style={{ color: '#2C3E50' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>{desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl py-6 text-center" style={{ background: '#34495E' }}>
          <h2 className="font-display text-2xl font-bold text-white">Our Community Standards</h2>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {pillars.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4" style={{ background: 'rgba(201,168,76,0.18)' }}>
              <Icon className="w-5 h-5" style={{ color: '#C9A84C' }} />
            </div>
            <h3 className="font-semibold text-base mb-2" style={{ color: '#1A2744' }}>{title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Community Guidelines */}
      <section className="rounded-2xl p-8 mb-8" style={{ background: '#1A2744' }}>
        <h2 className="font-display text-2xl font-bold mb-5 text-white">Our Community Standards</h2>
        <ul className="space-y-3">
          {[
            'Treat every member with kindness, dignity, and respect.',
            'Honor your commitments—if you can\'t make it, let your host or guest know.',
            'Keep personal and sensitive information private and confidential.',
            'Report any content or behavior that feels unsafe or inappropriate.',
            'Give freely and receive graciously—help is offered without judgment.',
          ].map((rule) => (
            <li key={rule} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(245,230,192,0.90)' }}>
              <span style={{ color: '#C9A84C' }}>✓</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Reporting */}
      <section className="rounded-2xl p-8 text-center" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <div className="text-3xl mb-3">🛡️</div>
        <h2 className="font-display text-2xl font-bold mb-2" style={{ color: '#1A2744' }}>See something? Say something.</h2>
        <p className="text-sm leading-relaxed max-w-xl mx-auto mb-5" style={{ color: '#6b5c3e' }}>
          If you ever feel unsafe or encounter content that violates our standards, our moderation team is here to help.
          Reach out and we\'ll respond promptly.
        </p>
        <a href="/contact" className="inline-block px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }}>
          Contact Our Team
        </a>
      </section>

      {/* Terms & Conditions */}
      <section className="mt-8 pt-8 border-t" style={{ borderColor: '#C9A84C' }}>
        <div className="text-center">
          <h2 className="font-display text-xl font-bold mb-3" style={{ color: '#1A2744' }}>Terms & Conditions</h2>
          <p className="text-sm leading-relaxed max-w-2xl mx-auto mb-4" style={{ color: '#6b5c3e' }}>
            By using Circles of Giving, you agree to our community guidelines, privacy practices, and terms of use.
            Please review our full policies to understand your rights and responsibilities as a member.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/terms" className="inline-block px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }}>
              Terms of Use
            </Link>
            <Link to="/privacy" className="inline-block px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity" style={{ background: '#FAF7EE', color: '#1A2744', border: '1.5px solid #C9A84C' }}>
              Privacy Policy
            </Link>
          </div>
          <p className="text-xs mt-6" style={{ color: '#6b5c3e' }}>
            © {new Date().getFullYear()} Circles of Giving. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}