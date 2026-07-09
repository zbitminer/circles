export default function BuildingCommunitySection() {
  return (
    <section className="bg-white" style={{ borderBottom: '1px solid #e0e0e0' }}>
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Left Block — Philosophy with image */}
          <div className="rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-xl" style={{ border: '2px solid #1A1A1A', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <img
              src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/d0bc78a84_generated_image.png"
              alt="Jewish Israeli women mentoring and sharing over tea"
              className="w-full aspect-[16/7] object-cover" />
            
            <div className="p-6 md:p-10 flex-1 flex flex-col justify-center" style={{ background: '#fff' }}>
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: '#D95D1A' }}>
                 · CONNECTION
              </span>
              <h2 className="font-bold text-2xl md:text-3xl mb-6 leading-tight" style={{ color: '#1A1A1A', fontFamily: 'Georgia, serif' }}>
                BUILDING COMMUNITY THRU GIVING
              </h2>
              <div className="space-y-3">
                <p className="text-lg font-bold uppercase tracking-wide" style={{ color: '#D35E35' }}>
                  I contribute what I have
                </p>
                <p className="text-lg font-bold uppercase tracking-wide" style={{ color: '#247D7D' }}>
                  I receive what I need
                </p>
                <p className="text-base leading-relaxed" style={{ color: '#555' }}>
                  Together, we solve real social challenges — and build circles of belonging that sustain us all.
                </p>
              </div>
            </div>
          </div>

          {/* Right Block — Mission Statement with image */}
          <div className="rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-xl" style={{ background: '#1A1A1A', border: '2px solid #C99738', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
            <img
              src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/2f5f4085f_generated_image.png"
              alt="Israeli volunteers preparing food packages at community kitchen"
              className="w-full aspect-[16/7] object-cover" />
            
            <div className="p-6 md:p-10 flex-1 flex flex-col justify-center" style={{ borderTop: '2px solid #C99738' }}>
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: '#C99738' }}>
                OUR MISSION
              </span>
              <h3 className="font-bold text-2xl md:text-3xl mb-5 leading-tight" style={{ color: '#fff', fontFamily: 'Georgia, serif' }}>
                CIRCLES OF GIVING
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Is a vibrant, expanding community of members who want to make meaningful changes in their lives
                individually &amp; collectively — by giving and sharing their unique talents, skills + passion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>);

}