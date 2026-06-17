import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ArrowRight } from 'lucide-react';
import TestimonialsSection from '@/components/TestimonialsSection';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="pb-24 md:pb-0">

      {/* Hero */}
      <section className="relative bg-white overflow-hidden" style={{ borderBottom: '1px solid #e0e0e0' }}>
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: 'rgba(217,93,26,0.08)', color: '#D95D1A' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#D95D1A' }} />
            347 MEMBERS · SAFED & BEYOND
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-3xl mx-auto" style={{ color: '#1A1A1A' }}>
            A Community Platform Based on Giving, Receiving & Belonging
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#555' }}>
            Share your talents, skills, & passions. Support one another. Grow together.
          </p>

          {/* CTA */}
          {!user ? (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              style={{ background: '#D95D1A', color: '#fff' }}
            >
              Join the Circle — Free <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              to="/opportunities"
              className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              style={{ background: '#D95D1A', color: '#fff' }}
            >
              Explore Opportunities <ArrowRight className="w-5 h-5" />
            </Link>
          )}

          {/* Hero Illustration */}
          <div className="mt-12 flex justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, rgba(217,93,26,0.06), rgba(0,125,125,0.06), rgba(218,165,32,0.06))' }}>
              <img
                src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/2b5f3a1e3_generated_image.png"
                alt="Diverse hands reaching toward the center"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How the Circle Works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-16">
        {/* Abstract circle artwork */}
        <div className="flex justify-center mb-8">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full relative overflow-hidden" style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(217,93,26,0.25), transparent 50%), radial-gradient(circle at 70% 40%, rgba(0,125,125,0.20), transparent 50%), radial-gradient(circle at 50% 70%, rgba(218,165,32,0.22), transparent 50%), radial-gradient(circle at 40% 60%, rgba(217,93,26,0.12), transparent 40%)',
          }}>
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Abstract lotus/flower shapes */}
              <g transform="translate(100,100)">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const x = Math.cos(rad) * 42;
                  const y = Math.sin(rad) * 42;
                  return (
                    <ellipse key={i} cx={x} cy={y} rx={14} ry={22} fill="none" stroke={i % 2 === 0 ? '#D95D1A' : i % 3 === 0 ? '#007D7D' : '#DAA520'} strokeWidth="1.5" transform={`rotate(${angle + 20}, ${x}, ${y})`} opacity="0.7" />
                  );
                })}
                <circle cx="0" cy="0" r="18" fill="none" stroke="#D95D1A" strokeWidth="1.5" opacity="0.5" />
                <circle cx="0" cy="0" r="28" fill="none" stroke="#DAA520" strokeWidth="1" opacity="0.4" />
                <circle cx="0" cy="0" r="38" fill="none" stroke="#007D7D" strokeWidth="0.8" opacity="0.3" />
              </g>
            </svg>
          </div>
        </div>

        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#D95D1A' }}>HOW THE CIRCLE WORKS</span>
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: '#1A1A1A' }}>Register first to access the full platform</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Give Card */}
          <div className="group flex flex-col items-center gap-4 p-8 text-center rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(217,93,26,0.08)' }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                {/* Lotus/flower icon */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const cx = 18 + Math.cos(rad) * 8;
                  const cy = 18 + Math.sin(rad) * 8;
                  return <ellipse key={i} cx={cx} cy={cy} rx="4" ry="9" stroke="#D95D1A" strokeWidth="1.5" transform={`rotate(${angle}, ${cx}, ${cy})`} fill="none" />;
                })}
                <circle cx="18" cy="18" r="4" fill="#D95D1A" opacity="0.3" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold" style={{ color: '#D95D1A' }}>Give.</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
              Share your time, skills, talents, or resources.
            </p>
            <Link to="/opportunities" className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity mt-2" style={{ background: '#D95D1A', color: '#fff' }}>
              Give Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Receive Card */}
          <div className="group flex flex-col items-center gap-4 p-8 text-center rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,125,125,0.08)' }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                {/* Hands cradling figure */}
                <path d="M8 20c-2 0-4 2-4 4v4c0 2 2 4 4 4h1" stroke="#007D7D" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M28 20c2 0 4 2 4 4v4c0 2-2 4-4 4h-1" stroke="#007D7D" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="18" cy="14" r="5" stroke="#007D7D" strokeWidth="1.5" />
                <path d="M13 18c0-3 2-5 5-5s5 2 5 5" stroke="#007D7D" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="16" cy="13" r="0.8" fill="#007D7D" />
                <circle cx="20" cy="13" r="0.8" fill="#007D7D" />
                <path d="M16 17c0 0 1 1.5 2 1.5s2-1.5 2-1.5" stroke="#007D7D" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold" style={{ color: '#007D7D' }}>Receive.</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
              Find support from trusted community members.
            </p>
            <Link to="/sos" className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity mt-2" style={{ background: '#007D7D', color: '#fff' }}>
              Get Support <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Belong Card */}
          <div className="group flex flex-col items-center gap-4 p-8 text-center rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(218,165,32,0.08)' }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                {/* Three linked figures */}
                <circle cx="10" cy="12" r="4" stroke="#DAA520" strokeWidth="1.5" />
                <circle cx="26" cy="12" r="4" stroke="#DAA520" strokeWidth="1.5" />
                <circle cx="18" cy="24" r="4" stroke="#DAA520" strokeWidth="1.5" />
                <line x1="12.5" y1="14.5" x2="16" y2="21.5" stroke="#DAA520" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="23.5" y1="14.5" x2="20" y2="21.5" stroke="#DAA520" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="10" y1="15" x2="26" y2="15" stroke="#DAA520" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="2 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold" style={{ color: '#DAA520' }}>Belong.</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
              Connect with others through our community programs and grow together.
            </p>
            <Link to="/directory" className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity mt-2" style={{ background: '#DAA520', color: '#fff' }}>
              Join the Community <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {!user && (
          <p className="text-center text-sm mt-8 py-3 px-6 rounded-xl border" style={{ background: '#fff', borderColor: '#e0e0e0', color: '#555' }}>
            🔒 <strong>Must register first</strong> to give, receive, or connect.{' '}
            <Link to="/register" className="font-bold hover:underline" style={{ color: '#D95D1A' }}>Create your free account →</Link>
          </p>
        )}
      </section>

      {/* Mission */}
      <section style={{ background: '#F9F9F9', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#D95D1A' }}>Our Mission</span>
          <p className="text-xl md:text-2xl font-bold leading-relaxed mb-4" style={{ color: '#1A1A1A' }}>
            I contribute what I have. I receive what I need. Together, we solve <span className="underline decoration-2" style={{ textDecorationColor: '#DAA520' }}>real</span> social challenges — and build circles of belonging that sustain us all.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#555' }}>
            Circles of Giving is a vibrant, expanding community of members who want to make meaningful changes in their lives individually and collectively — by giving and sharing their unique talents, skills, and passions.
          </p>
        </div>
      </section>

      {/* Platform Goals */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#D95D1A' }}>Platform Goals</span>
          <h2 className="text-2xl font-extrabold" style={{ color: '#1A1A1A' }}>From an individual perspective</h2>
        </div>
        <div className="space-y-4">
          {[
            { num: '01', title: 'I choose generosity over self-interest', body: "I come here to give — not because I have to, but because I've discovered that giving freely is one of the greatest joys I know." },
            { num: '02', title: 'I bring my spark', body: "I have a passion, a skill, a story that only I can share. This is the place where I light it up and offer it to others." },
            { num: '03', title: 'I teach and I learn', body: "I am both a teacher and a student here. My knowledge grows when I share it — and I'm always surprised by what others teach me in return." },
            { num: '04', title: 'I help solve what no one can solve alone', body: "I bring what I have to the table. Together, we turn individual contributions into something powerful enough to change communities." },
            { num: '05', title: 'I belong here', body: "I am a full member of this circle — contributing, receiving, and growing alongside everyone in it." },
          ].map(({ num, title, body }) => (
            <div key={num} className="flex gap-5 items-start p-6 rounded-2xl border" style={{ background: '#fff', borderColor: '#e0e0e0' }}>
              <span className="text-2xl font-extrabold flex-shrink-0 leading-none pt-1" style={{ color: 'rgba(217,93,26,0.3)' }}>{num}</span>
              <div>
                <h3 className="font-bold text-lg underline decoration-2 underline-offset-2 mb-2" style={{ color: '#1A1A1A', textDecorationColor: '#DAA520' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div id="trust">
        <TestimonialsSection />
      </div>

      {/* Volunteer Levels */}
      <section style={{ background: '#F9F9F9', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
        <div className="max-w-4xl mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#D95D1A' }}>Volunteer Pathways</span>
            <h2 className="text-2xl font-extrabold" style={{ color: '#1A1A1A' }}>Find Your Place in the Circle</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { level: 'Beginner', title: 'Community Helper', time: '2–4 hours/month', skills: 'Basic conversation, empathy', tasks: ['Help neighbors with errands', 'Provide companionship', 'Join local cleanup events', 'Share simple skills'], borderColor: '#007D7D', badgeColor: '#007D7D', badgeBg: 'rgba(0,125,125,0.1)' },
              { level: 'Intermediate', title: 'Skill Sharer', time: '6–10 hours/month', skills: 'A teachable skill or profession', tasks: ['Run a workshop or class', 'Mentor someone in your field', 'Offer rides or tech support', 'Coordinate a community event'], borderColor: '#D95D1A', badgeColor: '#D95D1A', badgeBg: 'rgba(217,93,26,0.1)' },
              { level: 'Advanced', title: 'Circle Leader', time: '10+ hours/month', skills: 'Leadership & organization', tasks: ['Lead a volunteer team', 'Launch a giving initiative', 'Partner with organizations', 'Represent the community'], borderColor: '#DAA520', badgeColor: '#DAA520', badgeBg: 'rgba(218,165,32,0.1)' },
            ].map(({ level, title, time, skills, tasks, borderColor, badgeColor, badgeBg }) => (
              <div key={title} className="p-6 rounded-2xl border-2" style={{ background: '#fff', borderColor }}>
                <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full" style={{ background: badgeBg, color: badgeColor }}>{level}</span>
                <h3 className="text-xl font-extrabold mt-3 mb-3" style={{ color: '#1A1A1A' }}>{title}</h3>
                <div className="text-xs space-y-1 mb-4 border-l-2 pl-3" style={{ borderColor, color: '#555' }}>
                  <p><span className="font-bold" style={{ color: '#1A1A1A' }}>Time:</span> {time}</p>
                  <p><span className="font-bold" style={{ color: '#1A1A1A' }}>Skills:</span> {skills}</p>
                </div>
                <p className="text-xs font-bold mb-2" style={{ color: '#1A1A1A' }}>What You'll Do:</p>
                <ul className="space-y-1.5">
                  {tasks.map(t => (
                    <li key={t} className="text-xs flex gap-2" style={{ color: '#555' }}>
                      <span style={{ color: badgeColor }} className="flex-shrink-0">✦</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/opportunities" className="inline-flex items-center gap-2 font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity" style={{ background: '#D95D1A', color: '#fff' }}>
              Start Here <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section style={{ background: '#1A1A1A' }}>
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#fff' }}>Your Time is Valuable</h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
            In a world that measures worth in currency, we measure it in connection. Join hundreds of volunteers redefining community, one hour at a time.
          </p>
          {user ? (
            <Link to="/profile" className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg" style={{ background: '#D95D1A', color: '#fff' }}>
              Create Your Profile <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link to="/register" className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg" style={{ background: '#D95D1A', color: '#fff' }}>
              Join Now <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>

    </div>
  );
}