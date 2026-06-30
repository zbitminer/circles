const SPOTLIGHTS = [
  {
    quote: 'Every circle we open brings another family into the community. That\'s what keeps me going.',
    name: 'Rivka M.',
    role: 'Community Circle Leader · Jerusalem',
    bg: '#7E3D8D',
    img: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/214ad94aa_generated_image.png',
  },
  {
    quote: 'I came to give, but I received so much more — friendships, support, and a real sense of belonging.',
    name: 'Noa S.',
    role: 'Volunteer Coordinator · Tel Aviv',
    bg: '#363840',
    img: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/699fb145d_generated_image.png',
  },
];

export default function VolunteerSpotlightSection() {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10 items-start">
          {/* Left — Text */}
          <div className="lg:col-span-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: '#D95D1A' }}>REAL PEOPLE. REAL IMPACT</span>
            <h4 className="text-2xl font-bold mb-3" style={{ color: '#1A1A1A', fontFamily: 'Georgia, serif' }}>
              In their own words.
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
              From first-time givers to the most devoted volunteers in our community — here's what they're building
              on Circles of Giving.
            </p>
          </div>

          {/* Right — Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {SPOTLIGHTS.map((s) => (
              <div key={s.name} className="rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-xl hover:-translate-y-1" style={{ background: s.bg, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
                <img
                  src={s.img}
                  alt={s.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-6 text-center flex-1 flex flex-col justify-center" style={{ borderTop: '2px solid #C99738' }}>
                  <p className="text-white text-sm leading-relaxed mb-4">"{s.quote}"</p>
                  <p className="text-white font-bold text-sm">{s.name}</p>
                  <p className="text-white/70 text-xs">{s.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}