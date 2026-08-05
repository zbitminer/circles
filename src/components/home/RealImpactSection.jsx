import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';

export default function RealImpactSection() {
  return (
    <section className="bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl border border-brand-gold/70 bg-card shadow-[0_18px_50px_rgba(26,26,26,0.12)]">
          <div className="relative lg:col-span-5 min-h-[320px]">
            <img
              src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/f3f10b37d_generated_image.png"
              alt="Israeli community gathering sharing food outdoors in Safed"
              width="720"
              height="720"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-brand-gold/60 bg-black/75 p-4 backdrop-blur-sm">
              <p className="text-sm font-semibold leading-relaxed text-white">
                “Giving is not only what we deliver — it is the relationship we build at every door.”
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 md:p-10 lg:p-12">
            




            

            <h2 className="max-w-xl text-3xl md:text-5xl font-extrabold leading-tight text-foreground text-balance">
              A Hot Meal Is Also A <span className="text-brand-gold">Hello.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-base md:text-lg leading-8 text-muted-foreground">
              Every week, Circles members bring food, warmth, and presence to neighbours who need it most. This is what giving looks like — not just a donation, but a knock on the door and a familiar smile.
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-brand-gold/50 bg-brand-gold/10 p-4">
                <p className="text-2xl font-extrabold text-brand-orange">Food</p>
                <p className="mt-1 text-sm text-muted-foreground">Practical care</p>
              </div>
              <div className="rounded-2xl border border-brand-teal/40 bg-brand-teal/10 p-4">
                <p className="text-2xl font-extrabold text-brand-teal">Warmth</p>
                <p className="mt-1 text-sm text-muted-foreground">Human presence</p>
              </div>
              <div className="rounded-2xl border border-brand-gold/50 bg-brand-gold/10 p-4">
                <p className="text-2xl font-extrabold text-brand-gold">Belonging</p>
                <p className="mt-1 text-sm text-muted-foreground">Lasting circles</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/opportunities"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-extrabold text-white shadow-lg transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2">
                
                Start Giving In Your City <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-gold/70 px-6 py-3 text-sm font-extrabold text-foreground transition-colors duration-200 hover:bg-brand-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2">
                
                Learn Our Mission
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>);

}