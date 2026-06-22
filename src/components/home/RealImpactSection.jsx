import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';

export default function RealImpactSection() {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg">
          {/* Left — Photo */}
          <div className="md:w-1/2 h-64 md:h-auto">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
              alt="Community members sharing a meal"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right — Dark content */}
          <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center" style={{ background: '#26292B' }}>
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4" style={{ color: '#D9D9D9' }} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#D9D9D9' }}>
                REAL IMPACT
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: '#fff', fontFamily: 'Georgia, serif' }}>
              A hot meal is also a <span style={{ color: '#F7E468' }}>hello.</span>
            </h2>

            {/* Body */}
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#E0E0E0' }}>
              Every week, members of Circles bring food, warmth, and presence to neighbours who need it most.
              This is what giving looks like — not a donation button, but a knock on the door.
            </p>

            {/* CTA */}
            <div>
              <Link
                to="/opportunities"
                className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-white"
                style={{ background: '#D66D75' }}
              >
                Start giving in your city <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}