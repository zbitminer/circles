import { Award, Heart } from 'lucide-react';

export default function VolunteerOfTheMonthSection() {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#C99738' }}>
            <Award className="w-4 h-4" /> Honoured Volunteer
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase leading-none tracking-tight" style={{ color: '#1A1A1A', fontFamily: "'Bebas Neue', system-ui, sans-serif", letterSpacing: '0.02em' }}>
            Meet Rachel
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-3xl shadow-xl max-w-3xl mx-auto" style={{ background: '#1A1A1A' }}>
          {/* Photo */}
          <div className="relative aspect-[4/5] md:aspect-auto">
            <img
              src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/984169b9e_IMG_1210.jpg"
              alt="Rachel, Volunteer of the Month"
              className="w-full h-full object-cover opacity-70" />
            
            {/* Design mask overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.75) 0%, rgba(26,26,26,0.15) 45%, rgba(217,93,26,0.18) 100%)' }} />
            
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full" style={{ background: '#D95D1A', color: '#fff' }}>
                <Award className="w-3.5 h-3.5" /> Honored Volunteer
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center p-6 md:p-8">
            <div className="h-1.5 w-16 mb-6" style={{ background: '#C99738' }} />
            <h3 className="text-4xl md:text-5xl font-extrabold uppercase leading-none tracking-tight mb-4" style={{ color: '#D95D1A', fontFamily: "'Bebas Neue', system-ui, sans-serif" }}>
              Rachel
            </h3>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
              This month we honor Rachel for her tireless dedication cooking and baking for our holistic healing programs.
              Every dish she prepares is made with warmth, care, and love — nourishing not just the body, but the spirit of
              everyone she serves.
            </p>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Rachel embodies the heart of our community: giving generously, showing up consistently, and reminding us all
              that healing begins with kindness. Thank you, Rachel. 💛
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#C99738' }}>
              <Heart className="w-5 h-5 fill-current" />
              Baking with love for our holistic healing programs
            </div>
          </div>
        </div>
      </div>
    </section>);

}