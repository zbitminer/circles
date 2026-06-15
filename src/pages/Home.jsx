import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Gift, HandHeart, Users, Sparkles, Heart, BookOpen, Leaf, Music, Activity, HelpingHand } from 'lucide-react';

const PLATFORM_GOALS = [
  { icon: '🤝', title: 'Build Real Connections', desc: 'Match members based on what they can give and what they need.' },
  { icon: '🌱', title: 'Grow Together', desc: 'Develop skills, confidence, and purpose through shared action.' },
  { icon: '💡', title: 'Solve Social Challenges', desc: 'Address real community needs — from loneliness to resource gaps.' },
  { icon: '🏡', title: 'Create Belonging', desc: 'Foster circles of trust where everyone has a place and a role.' },
];

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="pb-24 md:pb-0">

      {/* ① Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 leading-tight">
            I Give. I Receive.<br />I Belong. I Grow.
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            I contribute what I have. I receive what I need. Together, we solve real social challenges — and build circles of belonging through connections.
          </p>
          {!user && (
            <Link
              to="/register"
              className="inline-block bg-accent text-white font-bold text-lg px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg"
            >
              Register — Join the Circle
            </Link>
          )}
          {user && (
            <Link
              to="/feed"
              className="inline-block bg-accent text-white font-bold text-lg px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg"
            >
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

      {/* ④ Mission */}
      <section className="bg-muted">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">Our Mission</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-foreground">
            A vibrant, expanding community of members who want to make meaningful changes.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Circles of Giving is a living, growing community of people who make meaningful changes in their lives — individually and collectively — by giving and sharing their unique talents, skills, and passions.
          </p>
        </div>
      </section>

      {/* ⑤ Platform Goals */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <h2 className="font-display text-2xl font-bold text-center mb-8 text-foreground">Platform Goals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PLATFORM_GOALS.map(({ icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-6 flex gap-4 items-start">
              <span className="text-3xl flex-shrink-0">{icon}</span>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

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