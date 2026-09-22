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
import WaysToEngageSection from '@/components/home/WaysToEngageSection';
import DecorativeCircles from '@/components/home/DecorativeCircles';
import SafeExplorationBanner from '@/components/SafeExplorationBanner';

export default function Home() {
  const { user } = useAuth();
  const [heroImgError, setHeroImgError] = useState(false);

  return (
    <div className="pb-24 md:pb-0">

      {/* Hero */}
      <section className="relative bg-card overflow-hidden border-b border-border">
        <DecorativeCircles variant="light" />
        <div className="max-w-4xl mx-auto px-4 py-10 md:py-24 text-center relative z-10">
          {/* Badge */}
          


          

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-3xl mx-auto text-foreground">
            A Community Based on Giving, Receiving & Belonging
          </h1>

          {/* Subheadline */}
          <p className="mb-10 max-w-2xl mx-auto leading-relaxed text-2xl md:text-2xl font-body text-muted-foreground">
            Share your talents, skills, & passions. Support one another. Grow together.
          </p>

          {/* CTA */}
          {!user ?
          <div className="flex flex-col items-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg hover:shadow-xl">
                Join the Circle — Free <ArrowRight className="w-5 h-5" />
              </Link>
          </div> :
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            




            
            




            
          </div>
          }

          {/* Hero Illustration */}
          <div className="mt-12 flex justify-center">
            <div className="w-80 h-80 md:w-[36rem] md:h-[36rem] rounded-full flex items-center justify-center relative bg-gradient-to-br from-brand-50 via-brand-100 to-accent/20">
              {!heroImgError &&
              <img
                src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/5102d156d_Desogn_R3_page_1.jpeg"
                alt="Diverse hands reaching toward the center"
                className="w-full h-full object-cover rounded-full"
                onError={() => setHeroImgError(true)} />

              }
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Engage — Give / Receive / Belong */}
      <WaysToEngageSection>
        {!user && <SafeExplorationBanner location="Safed, Israel" className="mt-8" />}
      </WaysToEngageSection>

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
      <section className="relative overflow-hidden bg-foreground text-background border-t-4 border-primary">
        <DecorativeCircles variant="dark" />
        <div className="max-w-2xl mx-auto px-4 py-10 md:py-16 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-background">Your Time is Valuable</h2>
          <p className="text-lg leading-relaxed mb-8 text-background/70">
            In a world that measures worth in currency, we measure it in connection. Join hundreds of volunteers redefining community, one hour at a time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ?
            <Link to="/profile" className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg">
                Create Your Profile <ArrowRight className="w-5 h-5" />
              </Link> :

            <Link to="/register" className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg">
                Join Now <ArrowRight className="w-5 h-5" />
              </Link>
            }
            <Link to="/donate" className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full text-background border-2 border-background/40 hover:bg-background/10 transition-colors shadow-lg">
              <Heart className="w-5 h-5" /> Donate
            </Link>
          </div>
        </div>
      </section>

    </div>);

}