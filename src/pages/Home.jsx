import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ArrowRight, Heart } from 'lucide-react';
import BuildingCommunitySection from '@/components/home/BuildingCommunitySection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import LiveCommunitySection from '@/components/home/LiveCommunitySection';
import UpcomingCirclesSection from '@/components/home/UpcomingCirclesSection';
import CommunityGridSection from '@/components/home/CommunityGridSection';
import VolunteerSpotlightSection from '@/components/home/VolunteerSpotlightSection';
import RealImpactSection from '@/components/home/RealImpactSection';

export default function Home() {
  const [user, setUser] = useState(null);
  const [heroImgError, setHeroImgError] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="pb-24 md:pb-0">

      {/* Hero */}
      <section className="relative bg-white overflow-hidden" style={{ borderBottom: '1px solid #e0e0e0' }}>
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center relative z-10">
          {/* Badge */}
          


          

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-3xl mx-auto" style={{ color: '#1A1A1A' }}>
            A Community Platform Based on Giving, Receiving & Belonging
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#555' }}>
            Share your talents, skills, & passions. Support one another. Grow together.
          </p>

          {/* CTA */}
          {!user ?
          <Link
            to="/register"
            className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            style={{ background: '#D95D1A', color: '#fff' }}>
            
              Join the Circle — Free <ArrowRight className="w-5 h-5" />
            </Link> :

          <Link
            to="/opportunities"
            className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            style={{ background: '#D95D1A', color: '#fff' }}>
            
              Explore Opportunities <ArrowRight className="w-5 h-5" />
            </Link>
          }

          {/* Hero Illustration */}
          <div className="mt-12 flex justify-center">
            <div className="w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, rgba(217,93,26,0.06), rgba(0,125,125,0.06), rgba(218,165,32,0.06))' }}>
              {!heroImgError &&
              <img
                src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/5102d156d_Desogn_R3_page_1.jpeg"
                alt="Diverse hands reaching toward the center"
                className="w-full h-full object-contain"
                onError={() => setHeroImgError(true)} />

              }
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Engage — Give / Receive / Belong */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#D95D1A' }}>WAYS TO ENGAGE</span>
          <h2 className="text-2xl md:text-3xl font-extrabold [font-family:'Bebas_Neue',_system-ui]" style={{ color: '#1A1A1A' }}>Give, Receive, or Belong</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Give Card */}
          <div className="group flex flex-col items-center gap-4 p-8 text-center rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(211,94,53,0.08)' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                {/* Flower with heart center */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                  const rad = angle * Math.PI / 180;
                  const cx = 20 + Math.cos(rad) * 9;
                  const cy = 20 + Math.sin(rad) * 9;
                  return <path key={i} d={`M ${cx} ${cy} C ${cx + 4} ${cy - 6}, ${cx - 4} ${cy - 6}, ${cx} ${cy}`} stroke="#D35E35" strokeWidth="1.5" fill="none" strokeLinecap="round" transform={`rotate(${angle + 90}, ${cx}, ${cy})`} />;
                })}
                <path d="M20 17 C 18 14, 15 15, 15 18 C 15 20, 20 23, 20 23 C 20 23, 25 20, 25 18 C 25 15, 22 14, 20 17 Z" fill="#D35E35" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold" style={{ color: '#D35E35', fontFamily: 'Georgia, serif' }}>Give.</h2>
            <p className="leading-relaxed [font-family:'Bebas_Neue',_system-ui] text-2xl" style={{ color: '#555' }}>
              Share your time, skills, talents, or resources.
            </p>
            <Link to="/opportunities" className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity mt-2" style={{ background: '#D35E35', color: '#fff' }}>
              Give Now →
            </Link>
          </div>

          {/* Receive Card */}
          <div className="group flex flex-col items-center gap-4 p-8 text-center rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(36,125,125,0.08)' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                {/* Figure being held by hands */}
                <circle cx="20" cy="13" r="4.5" stroke="#247D7D" strokeWidth="1.5" fill="none" />
                <path d="M15 20 C 15 17, 17 15, 20 15 C 23 15, 25 17, 25 20 L 25 24 L 15 24 Z" stroke="#247D7D" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                <path d="M8 28 C 6 28, 5 30, 5 32 L 5 35 C 5 36, 6 37, 7 37 L 10 37" stroke="#247D7D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <path d="M32 28 C 34 28, 35 30, 35 32 L 35 35 C 35 36, 34 37, 33 37 L 30 37" stroke="#247D7D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <path d="M8 28 C 12 27, 15 26, 15 26" stroke="#247D7D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <path d="M32 28 C 28 27, 25 26, 25 26" stroke="#247D7D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold" style={{ color: '#247D7D', fontFamily: 'Georgia, serif' }}>Receive.</h2>
            <p className="leading-relaxed [font-family:'Bebas_Neue',_system-ui] text-2xl" style={{ color: '#555' }}>
              Find support from trusted community members.
            </p>
            <Link to="/sos" className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity mt-2" style={{ background: '#247D7D', color: '#fff' }}>
              Get Support →
            </Link>
          </div>

          {/* Belong Card */}
          <div className="group flex flex-col items-center gap-4 p-8 text-center rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,151,56,0.08)' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                {/* Circular network of people holding hands */}
                {[0, 72, 144, 216, 288].map((angle, i) => {
                  const rad = angle * Math.PI / 180;
                  const cx = 20 + Math.cos(rad) * 11;
                  const cy = 20 + Math.sin(rad) * 11;
                  return (
                    <g key={i}>
                      <circle cx={cx} cy={cy - 2} r="3" stroke="#C99738" strokeWidth="1.5" fill="none" />
                      <path d={`M ${cx - 3} ${cy + 1} L ${cx - 3} ${cy + 5} M ${cx + 3} ${cy + 1} L ${cx + 3} ${cy + 5}`} stroke="#C99738" strokeWidth="1.5" strokeLinecap="round" />
                    </g>);

                })}
                <circle cx="20" cy="20" r="11" stroke="#C99738" strokeWidth="1.2" fill="none" strokeDasharray="3 3" opacity="0.6" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold" style={{ color: '#C99738', fontFamily: 'Georgia, serif' }}>Belong.</h2>
            <p className="leading-relaxed [font-family:'Bebas_Neue',_system-ui] text-2xl" style={{ color: '#555' }}>
              Connect with others through our community programs and grow together.
            </p>
            <Link to="/directory" className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity mt-2" style={{ background: '#C99738', color: '#fff' }}>
              Join the Community →
            </Link>
          </div>
        </div>

        {!user &&
        <p className="text-center text-sm mt-8 py-3 px-6 rounded-xl border" style={{ background: '#fff', borderColor: '#e0e0e0', color: '#555' }}>
            🔒 <strong>Must register first</strong> to give, receive, or connect.{' '}
            <Link to="/register" className="font-bold hover:underline" style={{ color: '#D95D1A' }}>Create your free account →</Link>
          </p>
        }
      </section>

      {/* Building Community Thru Giving */}
      <BuildingCommunitySection />

      {/* How It Works — Three Steps. Infinite Impact. */}
      <HowItWorksSection />

      {/* Live Community — Happening Right Now */}
      <LiveCommunitySection />

      {/* Upcoming Circles */}
      <UpcomingCirclesSection />

      {/* Community Grid — Real People. Real Giving. */}
      <CommunityGridSection />

      {/* Volunteer Spotlight */}
      <VolunteerSpotlightSection />

      {/* Real Impact */}
      <RealImpactSection />

      {/* Closing CTA */}
      <section style={{ background: '#1A1A1A', borderTop: '3px solid #E67E22' }}>
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#fff' }}>Your Time is Valuable</h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
            In a world that measures worth in currency, we measure it in connection. Join hundreds of volunteers redefining community, one hour at a time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ?
            <Link to="/profile" className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg" style={{ background: '#E67E22', color: '#fff' }}>
                Create Your Profile <ArrowRight className="w-5 h-5" />
              </Link> :

            <Link to="/register" className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg" style={{ background: '#E67E22', color: '#fff' }}>
                Join Now <ArrowRight className="w-5 h-5" />
              </Link>
            }
            <Link to="/donate" className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg border-2" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
              <Heart className="w-5 h-5" /> Donate
            </Link>
          </div>
        </div>
      </section>

    </div>);

}