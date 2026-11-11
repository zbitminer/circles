import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { Heart, Users, Clock, Sparkles } from 'lucide-react';
import MemorialTribute from '@/components/about/MemorialTribute';

export default function About() {
  const { localize } = useLanguage();
  return localize(
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3" style={{ color: '#141414' }}>
          Together, We Build a Better Reality
        </h1>
        <p className="mt-5 text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: '#6b7280' }}>
          Through giving, receiving, compassion, and humanity.
        </p>
      </div>

      {/* Intro */}
      <section className="mb-10">
        <p className="text-base leading-relaxed mb-5" style={{ color: '#6b7280' }}>
          There's a spark in every person — a quiet ability to change someone else's life for the better. Most of us just need a place to let it out.
        </p>
        <p className="text-base leading-relaxed mb-5" style={{ color: '#6b7280' }}>
          That's what <strong style={{ color: '#141414' }}>Circles of Giving</strong> is.
        </p>
        <p className="text-base leading-relaxed mb-5" style={{ color: '#6b7280' }}>
          We're a community in Tzfat built on one simple, powerful idea: give what you can, receive what you need. No résumé required. No experience necessary. Just a willingness to show up for each other. When you give here, you'll find you receive too — and when you receive, you give something back in return. That's the circle. And every person who joins makes it wider, stronger, and more able to hold the people who need it most.
        </p>
        <p className="text-base leading-relaxed" style={{ color: '#6b7280' }}>
          This isn't charity handed down from above. It's neighbors helping neighbors. It's real people finding real ways to matter to each other — in whatever time they have, in whatever way they're able.
        </p>
      </section>

      {/* Why We're Here */}
      <section className="rounded-2xl p-8 mb-8" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
        <h2 className="font-display text-2xl font-bold mb-4" style={{ color: '#141414' }}>Why We're Here</h2>
        <p className="text-base leading-relaxed mb-6" style={{ color: '#6b7280' }}>
          We started with a vision: a community where nobody has to carry their hardest moments alone, and nobody has to sit on the sidelines of their own generosity.
        </p>
        <p className="text-base leading-relaxed mb-6" style={{ color: '#6b7280' }}>
          So we built both a virtual platform and a physical home — our center right here in Safed — to connect people who want to give their time and talent with people who need a hand and a heart. Together, they show up for each other in a few essential ways:
        </p>
        <div className="space-y-5">
          {[
            { icon: Clock, text: 'When someone needs help right now — our emergency response reaches people within 24–48 hours. No one should have to wait alone in a crisis.' },
            { icon: Heart, text: 'When someone feels forgotten — we work to lift up disadvantaged families and individuals, and to knit the wider community closer together.' },
            { icon: Sparkles, text: 'When someone wants to grow — we offer classes, training, and tools so people of every age can learn something new and walk away with real skills.' },
            { icon: Users, text: 'When someone is hurting — we sit with people through trauma and crisis, offering a steady hand through the hardest chapters of their lives.' },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0" style={{ background: '#141414', color: '#bd4c0f' }}>
                <Icon className="w-5 h-5" />
              </span>
              <p className="text-base leading-relaxed pt-1.5" style={{ color: '#6b7280' }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Heart of It All */}
      <section className="rounded-2xl p-8 mb-8 text-center" style={{ background: '#141414' }}>
        <h2 className="font-display text-2xl font-bold mb-4" style={{ color: '#bd4c0f' }}>The Heart of It All</h2>
        <p className="text-base leading-relaxed mb-4 max-w-2xl mx-auto" style={{ color: '#fbe8d4' }}>
          Step into our center in Safed and you'll feel it immediately: this is a place that's alive. People gather in the community café. Share their stories over coffee. Everyone carries a unique spark - talent, passion, skill. Here, we illuminate each other by teaching, sharing and learning together. Meet a friend they didn't know they needed. Sit in a workshop, join an event, discover a talent they forgot they had.
        </p>
        <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(245,230,192,0.85)' }}>
          This building isn't just a headquarters. It's the beating heart of everything we do — proof that community isn't an idea, it's something you can walk into.
        </p>
      </section>

      {/* The People Behind the Vision */}
      <section className="rounded-2xl p-8 mb-10 flex flex-col sm:flex-row gap-6 items-center sm:items-start" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
        <div className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold" style={{ background: '#141414', color: '#bd4c0f' }}>
          J.L.
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
            Joan Rachel Bracha Laurence- Founder and CEO is a social entrepreneur and community designer who has spent her career doing exactly one thing: building places where people heal and belong. From her first model community in Santa Clara, California, to a string of pioneering programs in Tzfat (from 1990) The Loving Children's Home, The Mother Child Healing Hostel, New Beginnings Hostel for pregnant unwed mothers, to a Single Mother’s Healing center — Joan has spent over three decades learning what makes a community actually work. Circles of Giving is the culmination of that life's work: a place built to foster unity by helping people give to one another.
          </p>
        </div>
      </section>

      <MemorialTribute />

      {/* This Is Where You Come In */}
      <section className="rounded-2xl p-8 mb-8 text-center" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
        <h2 className="font-display text-2xl font-bold mb-4" style={{ color: '#141414' }}>This Is Where You Come In</h2>
        <p className="text-base leading-relaxed mb-3 max-w-2xl mx-auto" style={{ color: '#6b7280' }}>
          You don't need special skills. You don't need extra time you don't have. You just need to be willing to give what you can — and to let this community give something back to you.
        </p>
        <p className="text-base leading-relaxed mb-6 max-w-2xl mx-auto" style={{ color: '#6b7280' }}>
          Come volunteer. Come learn. Come be part of the circle.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/register" className="inline-flex items-center gap-2 font-bold text-base px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-lg" style={{ background: '#141414', color: '#fff' }}>
            Join us
          </Link>
          <Link to="/donate" className="inline-flex items-center gap-2 font-bold text-base px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-lg border-2" style={{ background: 'transparent', color: '#141414', borderColor: '#bd4c0f' }}>
            <Heart className="w-4 h-4" /> Donate
          </Link>
        </div>
      </section>

      {/* Social Links */}
      <section className="text-center mb-14">
        <div className="flex items-center justify-center gap-2 text-sm flex-wrap" style={{ color: '#6b7280' }}>
          <Link to="/register" className="font-bold hover:underline" style={{ color: '#141414' }}>Join us</Link>
          <span style={{ color: '#bd4c0f' }}>/</span>
          <Link to="/donate" className="font-bold hover:underline" style={{ color: '#141414' }}>Donate</Link>
          <span style={{ color: '#bd4c0f' }}>·</span>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: '#141414' }}>Facebook</a>
          <span style={{ color: '#bd4c0f' }}>·</span>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: '#141414' }}>Instagram</a>
          <span style={{ color: '#bd4c0f' }}>·</span>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: '#141414' }}>YouTube</a>
        </div>
      </section>

    </div>
  );
}