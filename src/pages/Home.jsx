import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Gift, HandHeart, Users } from 'lucide-react';
import ImpactStats from '@/components/ImpactStats';
import TestimonialsSection from '@/components/TestimonialsSection';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="pb-24 md:pb-0">

      {/* ① Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          {/* Tagline — each word in a different color */}
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="text-white">I give.</span>{' '}
            <span className="text-accent">I receive.</span>{' '}
            <span className="text-yellow-300">I belong.</span>{' '}
            <span className="text-green-300">I grow.</span>
          </h1>

          <p className="text-primary-foreground/90 text-lg md:text-xl italic font-semibold mb-4">
            This is what happens when I step into the circle.
          </p>
          <p className="text-primary-foreground/75 text-base md:text-lg max-w-2xl mx-auto mb-3 leading-relaxed">
            When I give, support comes back to me. When I belong to something larger than myself, I grow further than I ever could on my own.
          </p>
          <p className="text-primary-foreground/90 text-lg font-semibold mb-10">
            When I enter the circle. I'm home.
          </p>

          {!user ? (
            <Link to="/register" className="inline-block bg-accent text-white font-bold text-lg px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg">
              Register — Join the Circle
            </Link>
          ) : (
            <Link to="/feed" className="inline-block bg-accent text-white font-bold text-lg px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg">
              Go to Community Feed →
            </Link>
          )}
        </div>
      </section>

      {/* ③ Give / Receive / Connect */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Give */}
          <Link to="/opportunities" className="group bg-card border-2 border-border hover:border-primary rounded-2xl p-8 text-center flex flex-col items-center gap-4 transition-all hover:shadow-lg">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <HandHeart className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Give</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              List what you have — time, skills, resources. Go to the <strong>Needs Board</strong> where members list what they want to give.
            </p>
            <span className="mt-auto text-primary text-sm font-semibold group-hover:underline">Browse Opportunities →</span>
          </Link>

          {/* Receive */}
          <Link to="/opportunities" className="group bg-card border-2 border-border hover:border-accent rounded-2xl p-8 text-center flex flex-col items-center gap-4 transition-all hover:shadow-lg">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <Gift className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Receive</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Find what you need — support, skills, community. Explore the <strong>Needs Board</strong> to see what others are offering.
            </p>
            <span className="mt-auto text-accent text-sm font-semibold group-hover:underline">Explore Needs Board →</span>
          </Link>

          {/* Connect */}
          <Link to="/directory" className="group bg-card border-2 border-border hover:border-[hsl(var(--brand-gold))] rounded-2xl p-8 text-center flex flex-col items-center gap-4 transition-all hover:shadow-lg">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
              <Users className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Connect</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Meet the people behind the circles. Go to the <strong>Community Profiles</strong> page to see all members.
            </p>
            <span className="mt-auto text-yellow-600 text-sm font-semibold group-hover:underline">View Community →</span>
          </Link>
        </div>

        {!user && (
          <p className="text-center text-sm text-muted-foreground mt-6 bg-muted rounded-xl py-3 px-4">
            🔒 <strong>Must register first</strong> to give, receive, or connect.{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create your free account →</Link>
          </p>
        )}
      </section>

      <ImpactStats />

      {/* ④ Mission */}
      <section className="bg-muted">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">Our Mission</span>
          <p className="text-foreground text-xl md:text-2xl font-bold leading-relaxed mb-4">
            I contribute what I have. I receive what I need. Together, we solve <span className="underline decoration-accent decoration-2">real</span> social challenges — and build circles of belonging that sustain us all.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed">
            Circles of Giving is a vibrant, expanding community of members who want to make meaningful changes in their lives individually and collectively — by giving and sharing their unique talents, skills, and passions.
          </p>
        </div>
      </section>

      {/* ⑤ Platform Goals — from an individual perspective */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-bold text-foreground">Platform Goals</h2>
          <p className="text-muted-foreground text-sm mt-1">From an individual perspective</p>
        </div>
        <div className="space-y-6">
          {[
            {
              num: '01',
              title: 'I choose generosity over self-interest',
              body: 'I come here to give — not because I have to, but because I\'ve discovered that giving freely is one of the greatest joys I know.',
            },
            {
              num: '02',
              title: 'I bring my spark',
              body: 'I have a passion, a skill, a story that only I can share. This is the place where I light it up and offer it to others.',
            },
            {
              num: '03',
              title: 'I teach and I learn',
              body: 'I am both a teacher and a student here. My knowledge grows when I share it — and I\'m always surprised by what others teach me in return.',
            },
            {
              num: '04',
              title: 'I help solve what no one can solve alone',
              body: 'I bring what I have to the table. Together, we turn individual contributions into something powerful enough to change communities.',
            },
            {
              num: '05',
              title: 'I belong here',
              body: 'I am a full member of this circle — contributing, receiving, and growing alongside everyone in it.',
            },
          ].map(({ num, title, body }) => (
            <div key={num} className="bg-card border border-border rounded-2xl p-6 flex gap-5 items-start">
              <span className="text-2xl font-display font-bold text-primary/30 flex-shrink-0 leading-none pt-1">{num}</span>
              <div>
                <h3 className="font-semibold text-foreground text-lg underline decoration-accent decoration-2 underline-offset-2 mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <TestimonialsSection />

      {/* ⑥ I Open My Door CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto px-6 py-14 text-center">
          <span className="text-4xl mb-4 block">🚪</span>
          <h2 className="font-display text-3xl font-bold mb-4">I Open My Door</h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Ready to open yours? Join a community that welcomes you — exactly as you are.
          </p>
          {user ? (
            <Link to="/feed" className="inline-block bg-accent text-white font-bold text-lg px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg">
              Enter the Community →
            </Link>
          ) : (
            <Link to="/register" className="inline-block bg-accent text-white font-bold text-lg px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg">
              Register & Open My Door →
            </Link>
          )}
        </div>
      </section>

    </div>
  );
}