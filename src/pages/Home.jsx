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
          <p className="text-accent text-sm font-bold uppercase tracking-widest mb-4">Join Northern Israel's Time Bank Revolution</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Transform Lives<br />Through Giving
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-3 leading-relaxed">
            Exchange skills, build community, and create lasting impact — one hour at a time.
          </p>
          <p className="text-primary-foreground/60 text-sm mb-10 italic">
            I give. I receive. I belong. I grow.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/opportunities" className="inline-block bg-accent text-white font-bold text-lg px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg">
              Explore Opportunities
            </Link>
            {!user ? (
              <Link to="/register" className="inline-block border-2 border-primary-foreground/40 text-primary-foreground font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors">
                Start Your Journey
              </Link>
            ) : (
              <Link to="/feed" className="inline-block border-2 border-primary-foreground/40 text-primary-foreground font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors">
                Go to Community Feed →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Impact Stats Banner */}
      <section className="bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '2,847', label: 'Active Volunteers' },
            { value: '15,420', label: 'Hours Exchanged' },
            { value: '847', label: 'Skills Shared' },
            { value: '94', label: 'Communities Served' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="font-display text-3xl md:text-4xl font-bold text-accent mb-1">{value}</div>
              <div className="text-sm text-background/60">{label}</div>
            </div>
          ))}
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

      {/* Volunteer Pathway */}
      <section className="bg-muted">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Find Your Place in the Circle</h2>
            <p className="text-muted-foreground">Every contribution matters. Choose the commitment level that fits your life.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                level: 'Beginner Level',
                title: 'Community Helper',
                time: '2–4 hours/month',
                radius: 'Your neighborhood',
                skills: 'Basic conversation, empathy',
                tasks: ['Help neighbors with shopping or errands', 'Provide companionship to elderly community members', 'Participate in local cleanup events', 'Share simple skills (cooking, gardening, tech basics)'],
                color: 'border-green-400',
                badge: 'bg-green-100 text-green-800',
              },
              {
                level: 'Intermediate Level',
                title: 'Skill Sharer',
                time: '6–10 hours/month',
                radius: 'Your city',
                skills: 'A teachable skill or profession',
                tasks: ['Run a workshop or class', 'Mentor someone new to your field', 'Offer rides or tech support', 'Coordinate a community event'],
                color: 'border-primary',
                badge: 'bg-primary/10 text-primary',
              },
              {
                level: 'Advanced Level',
                title: 'Circle Leader',
                time: '10+ hours/month',
                radius: 'Regional impact',
                skills: 'Leadership, organization',
                tasks: ['Lead a volunteer team', 'Launch a new giving initiative', 'Partner with local organizations', 'Represent Circles of Giving in your community'],
                color: 'border-accent',
                badge: 'bg-accent/10 text-accent',
              },
            ].map(({ level, title, time, radius, skills, tasks, color, badge }) => (
              <div key={title} className={`bg-card border-2 ${color} rounded-2xl p-6`}>
                <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${badge}`}>{level}</span>
                <h3 className="font-display text-xl font-bold mt-3 mb-3">{title}</h3>
                <div className="text-xs text-muted-foreground space-y-1 mb-4 border-l-2 border-border pl-3">
                  <p><span className="font-semibold text-foreground">Time:</span> {time}</p>
                  <p><span className="font-semibold text-foreground">Radius:</span> {radius}</p>
                  <p><span className="font-semibold text-foreground">Skills:</span> {skills}</p>
                </div>
                <p className="text-xs font-semibold text-foreground mb-2">What You'll Do:</p>
                <ul className="space-y-1.5">
                  {tasks.map(t => (
                    <li key={t} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-accent flex-shrink-0">✦</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/opportunities" className="inline-block bg-primary text-primary-foreground font-bold px-8 py-3 rounded-2xl hover:opacity-90 transition-opacity">
              Start Here →
            </Link>
          </div>
        </div>
      </section>

      {/* "Your Time is Valuable" closing */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Your Time is Valuable</h2>
          <p className="text-primary-foreground/75 text-lg leading-relaxed mb-8">
            In a world that measures worth in currency, we measure it in connection. Join thousands of volunteers who are redefining community, one hour at a time.
          </p>
          {user ? (
            <Link to="/profile" className="inline-block bg-accent text-white font-bold text-lg px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg mr-4">
              Create Your Profile
            </Link>
          ) : (
            <Link to="/register" className="inline-block bg-accent text-white font-bold text-lg px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg mr-4">
              Join Now
            </Link>
          )}
        </div>
      </section>

    </div>
  );
}