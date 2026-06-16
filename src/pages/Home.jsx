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
      <section style={{ background: 'linear-gradient(180deg, #1A2744 0%, #0f1a30 100%)', borderBottom: '2px solid #C9A84C' }}>
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: '#F5E6C0' }}>
            Transform Lives<br />Through Giving
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-3 leading-relaxed" style={{ color: 'rgba(245,230,192,0.80)' }}>
            Exchange skills, build community, and create lasting impact — one hour at a time.
          </p>
          <p className="text-sm mb-10 italic" style={{ color: 'rgba(245,230,192,0.60)' }}>
            I give. I receive. I belong. I grow.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/opportunities" className="inline-block font-bold text-lg px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg" style={{ background: '#C9A84C', color: '#1A2744' }}>
              Explore Opportunities
            </Link>
            {!user ? (
              <Link to="/register" className="inline-block border-2 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors" style={{ borderColor: 'rgba(245,230,192,0.40)', color: '#F5E6C0' }}>
                Start Your Journey
              </Link>
            ) : (
              <Link to="/feed" className="inline-block border-2 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors" style={{ borderColor: 'rgba(245,230,192,0.40)', color: '#F5E6C0' }}>
                Go to Community Feed →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Impact Stats Banner */}
      <section style={{ background: '#1A2744', borderBottom: '1px solid #C9A84C' }}>
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '2,847', label: 'Active Volunteers' },
            { value: '15,420', label: 'Hours Exchanged' },
            { value: '847', label: 'Skills Shared' },
            { value: '94', label: 'Communities Served' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="font-display text-3xl md:text-4xl font-bold mb-1" style={{ color: '#C9A84C' }}>{value}</div>
              <div className="text-sm" style={{ color: 'rgba(245,230,192,0.60)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ③ Give / Receive / Connect */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/opportunities" className="group overflow-hidden flex flex-col items-center gap-4 p-8 text-center transition-all hover:shadow-xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '12px' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(26,39,68,0.10)' }}>
              <HandHeart className="w-8 h-8" style={{ color: '#1A2744' }} />
            </div>
            <h2 className="font-display text-2xl font-bold" style={{ color: '#1A2744' }}>Give</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>
              List what you have — time, skills, resources. Go to the <strong>Needs Board</strong> where members list what they want to give.
            </p>
            <span className="mt-auto text-sm font-semibold" style={{ color: '#C9A84C' }}>Browse Opportunities →</span>
          </Link>

          <Link to="/opportunities" className="group overflow-hidden flex flex-col items-center gap-4 p-8 text-center transition-all hover:shadow-xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '12px' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.15)' }}>
              <Gift className="w-8 h-8" style={{ color: '#C9A84C' }} />
            </div>
            <h2 className="font-display text-2xl font-bold" style={{ color: '#1A2744' }}>Receive</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>
              Find what you need — support, skills, community. Explore the <strong>Needs Board</strong> to see what others are offering.
            </p>
            <span className="mt-auto text-sm font-semibold" style={{ color: '#C9A84C' }}>Explore Needs Board →</span>
          </Link>

          <Link to="/directory" className="group overflow-hidden flex flex-col items-center gap-4 p-8 text-center transition-all hover:shadow-xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '12px' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.15)' }}>
              <Users className="w-8 h-8" style={{ color: '#C9A84C' }} />
            </div>
            <h2 className="font-display text-2xl font-bold" style={{ color: '#1A2744' }}>Connect</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>
              Meet the people behind the circles. Go to the <strong>Community Profiles</strong> page to see all members.
            </p>
            <span className="mt-auto text-sm font-semibold" style={{ color: '#C9A84C' }}>View Community →</span>
          </Link>
        </div>

        {!user && (
          <p className="text-center text-sm mt-6 rounded-xl py-3 px-4" style={{ background: '#FAF7EE', border: '1px solid #C9A84C', color: '#6b5c3e' }}>
            🔒 <strong>Must register first</strong> to give, receive, or connect.{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: '#1A2744' }}>Create your free account →</Link>
          </p>
        )}
      </section>

      <ImpactStats />

      {/* ④ Mission */}
      <section style={{ background: '#FAF7EE', borderTop: '1px solid #C9A84C', borderBottom: '1px solid #C9A84C' }}>
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: '#C9A84C' }}>Our Mission</span>
          <p className="text-xl md:text-2xl font-bold leading-relaxed mb-4" style={{ color: '#1A2744' }}>
            I contribute what I have. I receive what I need. Together, we solve <span className="underline decoration-2" style={{ textDecorationColor: '#C9A84C' }}>real</span> social challenges — and build circles of belonging that sustain us all.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#6b5c3e' }}>
            Circles of Giving is a vibrant, expanding community of members who want to make meaningful changes in their lives individually and collectively — by giving and sharing their unique talents, skills, and passions.
          </p>
        </div>
      </section>

      {/* ⑤ Platform Goals */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-bold" style={{ color: '#1A2744' }}>Platform Goals</h2>
          <p className="text-sm mt-1" style={{ color: '#6b5c3e' }}>From an individual perspective</p>
        </div>
        <div className="space-y-6">
          {[
            { num: '01', title: 'I choose generosity over self-interest', body: "I come here to give — not because I have to, but because I've discovered that giving freely is one of the greatest joys I know." },
            { num: '02', title: 'I bring my spark', body: "I have a passion, a skill, a story that only I can share. This is the place where I light it up and offer it to others." },
            { num: '03', title: 'I teach and I learn', body: "I am both a teacher and a student here. My knowledge grows when I share it — and I'm always surprised by what others teach me in return." },
            { num: '04', title: 'I help solve what no one can solve alone', body: "I bring what I have to the table. Together, we turn individual contributions into something powerful enough to change communities." },
            { num: '05', title: 'I belong here', body: "I am a full member of this circle — contributing, receiving, and growing alongside everyone in it." },
          ].map(({ num, title, body }) => (
            <div key={num} className="flex gap-5 items-start p-6 rounded-2xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
              <span className="text-2xl font-display font-bold flex-shrink-0 leading-none pt-1" style={{ color: 'rgba(201,168,76,0.5)' }}>{num}</span>
              <div>
                <h3 className="font-semibold text-lg underline decoration-2 underline-offset-2 mb-2" style={{ color: '#1A2744', textDecorationColor: '#C9A84C' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <TestimonialsSection />

      {/* Volunteer Pathway */}
      <section style={{ background: '#FAF7EE', borderTop: '1px solid #C9A84C', borderBottom: '1px solid #C9A84C' }}>
        <div className="max-w-4xl mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold mb-2" style={{ color: '#1A2744' }}>Find Your Place in the Circle</h2>
            <p style={{ color: '#6b5c3e' }}>Every contribution matters. Choose the commitment level that fits your life.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { level: 'Beginner Level', title: 'Community Helper', time: '2–4 hours/month', radius: 'Your neighborhood', skills: 'Basic conversation, empathy', tasks: ['Help neighbors with shopping or errands', 'Provide companionship to elderly community members', 'Participate in local cleanup events', 'Share simple skills (cooking, gardening, tech basics)'], borderColor: '#6b8f6e', badgeBg: '#e8f5e9', badgeColor: '#2d5a31' },
              { level: 'Intermediate Level', title: 'Skill Sharer', time: '6–10 hours/month', radius: 'Your city', skills: 'A teachable skill or profession', tasks: ['Run a workshop or class', 'Mentor someone new to your field', 'Offer rides or tech support', 'Coordinate a community event'], borderColor: '#1A2744', badgeBg: 'rgba(26,39,68,0.10)', badgeColor: '#1A2744' },
              { level: 'Advanced Level', title: 'Circle Leader', time: '10+ hours/month', radius: 'Regional impact', skills: 'Leadership, organization', tasks: ['Lead a volunteer team', 'Launch a new giving initiative', 'Partner with local organizations', 'Represent Circles of Giving in your community'], borderColor: '#C9A84C', badgeBg: 'rgba(201,168,76,0.15)', badgeColor: '#8a6a10' },
            ].map(({ level, title, time, radius, skills, tasks, borderColor, badgeBg, badgeColor }) => (
              <div key={title} className="p-6 rounded-2xl" style={{ background: '#FAF7EE', border: `2px solid ${borderColor}` }}>
                <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full" style={{ background: badgeBg, color: badgeColor }}>{level}</span>
                <h3 className="font-display text-xl font-bold mt-3 mb-3" style={{ color: '#1A2744' }}>{title}</h3>
                <div className="text-xs space-y-1 mb-4 border-l-2 pl-3" style={{ borderColor: '#C9A84C', color: '#6b5c3e' }}>
                  <p><span className="font-semibold" style={{ color: '#1A2744' }}>Time:</span> {time}</p>
                  <p><span className="font-semibold" style={{ color: '#1A2744' }}>Radius:</span> {radius}</p>
                  <p><span className="font-semibold" style={{ color: '#1A2744' }}>Skills:</span> {skills}</p>
                </div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#1A2744' }}>What You'll Do:</p>
                <ul className="space-y-1.5">
                  {tasks.map(t => (
                    <li key={t} className="text-xs flex gap-2" style={{ color: '#6b5c3e' }}>
                      <span style={{ color: '#C9A84C' }} className="flex-shrink-0">✦</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/opportunities" className="inline-block font-bold px-8 py-3 rounded-2xl hover:opacity-90 transition-opacity" style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }}>
              Start Here →
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section style={{ background: 'linear-gradient(180deg, #1A2744 0%, #0f1a30 100%)', borderTop: '2px solid #C9A84C' }}>
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: '#F5E6C0' }}>Your Time is Valuable</h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(245,230,192,0.75)' }}>
            In a world that measures worth in currency, we measure it in connection. Join thousands of volunteers who are redefining community, one hour at a time.
          </p>
          {user ? (
            <Link to="/profile" className="inline-block font-bold text-lg px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg" style={{ background: '#C9A84C', color: '#1A2744' }}>
              Create Your Profile
            </Link>
          ) : (
            <Link to="/register" className="inline-block font-bold text-lg px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg" style={{ background: '#C9A84C', color: '#1A2744' }}>
              Join Now
            </Link>
          )}
        </div>
      </section>

    </div>
  );
}