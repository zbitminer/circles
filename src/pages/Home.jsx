import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import BuildingCommunitySection from '@/components/home/BuildingCommunitySection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import LiveCommunitySection from '@/components/home/LiveCommunitySection';
import UpcomingCirclesSection from '@/components/home/UpcomingCirclesSection';
import VolunteerOfTheMonthSection from '@/components/home/VolunteerOfTheMonthSection';
import CommunityGridSection from '@/components/home/CommunityGridSection';
import VolunteerSpotlightSection from '@/components/home/VolunteerSpotlightSection';
import RealImpactSection from '@/components/home/RealImpactSection';

export default function Home() {
  const { user } = useAuth();
  const [heroImgError, setHeroImgError] = useState(false);

  return (
    <div className="pb-24 md:pb-0">

      {/* Hero */}
      <section className="relative bg-white overflow-hidden" style={{ borderBottom: '1px solid #e0e0e0' }}>
        <div className="max-w-4xl mx-auto px-4 py-10 md:py-24 text-center relative z-10">
          {/* Badge */}
          


          

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-3xl mx-auto" style={{ color: '#1A1A1A' }}>
            A Community Platform Based on Giving, Receiving & Belonging
          </h1>

          {/* Subheadline */}
          <p className="mb-10 max-w-2xl mx-auto leading-relaxed text-2xl md:text-2xl [font-family:'DM_Serif_Display',_serif]" style={{ color: '#555' }}>
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            




            
            




            
          </div>
          }

          {/* Hero Illustration */}
          <div className="mt-12 flex justify-center">
            <div className="w-80 h-80 md:w-[36rem] md:h-[36rem] rounded-full flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, rgba(217,93,26,0.06), rgba(0,125,125,0.06), rgba(218,165,32,0.06))' }}>
              {!heroImgError &&
              <img
                src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/5102d156d_Desogn_R3_page_1.jpeg"
                alt="Diverse hands reaching toward the center"
                className="w-full h-full object-contain scale-110"
                onError={() => setHeroImgError(true)} />

              }
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Engage — Give / Receive / Belong */}
      <section className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#D95D1A' }}>WAYS TO ENGAGE</span>
          <h2 className="text-2xl md:text-3xl font-extrabold [font-family:'Bebas_Neue',_system-ui]" style={{ color: '#1A1A1A' }}>Give, Receive, or Belong</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Give Card */}
          <div className="group flex flex-col items-center gap-3 p-6 md:p-8 md:gap-4 text-center rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'rgba(211,94,53,0.08)' }}>
              <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/d00dedeea_Black_and_White_Corporate_Pitch_Presentation.png" alt="Give" className="w-20 h-20 object-contain" />
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
          <div className="group flex flex-col items-center gap-3 p-6 md:p-8 md:gap-4 text-center rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'rgba(36,125,125,0.08)' }}>
              <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/30732f2b4_BlackandWhiteCorporatePitchPresentation.png" alt="Receive" className="w-20 h-20 object-contain" />
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
          <div className="group flex flex-col items-center gap-3 p-6 md:p-8 md:gap-4 text-center rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'rgba(201,151,56,0.08)' }}>
              <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/a6d867f57_Black_and_White_Corporate_Pitch_Presentation.png" alt="Belong" className="w-20 h-20 object-contain" />
            </div>
            <h2 className="text-2xl font-extrabold" style={{ color: '#C99738', fontFamily: 'Georgia, serif' }}>Belong.</h2>
            <p className="leading-relaxed [font-family:'Bebas_Neue',_system-ui] text-xl" style={{ color: '#555' }}>
              Connect with others through our community programs and grow together.
            </p>
            <Link to="/directory" className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity mt-2 text-xs" style={{ background: '#C99738', color: '#fff' }}>
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

      {/* Volunteer of the Month — Rachel */}
      <VolunteerOfTheMonthSection />

      {/* Volunteer Spotlight — social proof */}
      <VolunteerSpotlightSection />

      {/* Community Grid — Real People. Real Giving. */}
      <CommunityGridSection />

      {/* Real Impact */}
      <RealImpactSection />

      {/* Closing CTA */}
      <section style={{ background: '#1A1A1A', borderTop: '3px solid #E67E22' }}>
        <div className="max-w-2xl mx-auto px-4 py-10 md:py-16 text-center">
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