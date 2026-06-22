const SPOTLIGHTS = [
  {
    quote: 'We keep expanding to add more communities.',
    name: 'Tiffany Aliche',
    role: 'The Budgetnista',
    bg: '#7E3D8D',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
  },
  {
    quote: 'My membership on Mighty has insanely high retention. They\'re my marketing engine.',
    name: 'Amanda Goetz',
    role: 'Founder & CEO of House of Wise',
    bg: '#363840',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
  },
];

export default function VolunteerSpotlightSection() {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Left — Text */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-2" style={{ color: '#000' }}>REAL PEOPLE. REAL IMPACT</h2>
            <h3 className="text-lg font-semibold mb-6" style={{ color: '#000' }}>VOLUNTEER OF THE WEEK</h3>
            <h4 className="text-2xl font-bold mb-3" style={{ color: '#333', fontFamily: 'Georgia, serif' }}>
              In their own words.
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#333' }}>
              From first-time givers to the most devoted volunteers in our community — here's what they're building
              on Circles of Giving.
            </p>
          </div>

          {/* Right — Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SPOTLIGHTS.map((s) => (
              <div key={s.name} className="rounded-2xl p-6 flex flex-col items-center text-center" style={{ background: s.bg }}>
                <img
                  src={s.img}
                  alt={s.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-white/20"
                />
                <p className="text-white text-sm leading-relaxed mb-4">"{s.quote}"</p>
                <p className="text-white font-bold text-sm">{s.name}</p>
                <p className="text-white/70 text-xs">{s.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}