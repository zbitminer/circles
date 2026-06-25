export default function BuildingCommunitySection() {
  return (
    <section className="bg-white" style={{ borderBottom: '1px solid #e0e0e0' }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Block — Philosophy with image */}
          <div className="rounded-2xl overflow-hidden flex flex-col" style={{ border: '2px solid #1A1A1A' }}>
            <img
              src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/d0bc78a84_generated_image.png"
              alt="Jewish Israeli women mentoring and sharing over tea"
              className="w-full h-48 object-cover"
            />
            <div className="p-8 md:p-10 flex-1 flex flex-col justify-center" style={{ background: '#F5F3EF' }}>
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: '#888' }}>
                <span className="line-through" style={{ color: '#bbb' }}>THE FUTURE</span> · CONNECTION
              </span>
              <h2 className="font-bold text-2xl md:text-3xl mb-6 leading-tight" style={{ color: '#1A1A1A', fontFamily: 'Georgia, serif' }}>
                BUILDING COMMUNITY THRU GIVING
              </h2>
              <div className="space-y-3">
                <p className="text-lg font-bold uppercase tracking-wide" style={{ color: '#333' }}>
                  I contribute what I have
                </p>
                <p className="text-lg font-bold uppercase tracking-wide" style={{ color: '#333' }}>
                  I receive what I need
                </p>
                <p className="text-base leading-relaxed" style={{ color: '#555' }}>
                  Together, we solve real social challenges — and build circles of belonging that sustain us all.
                </p>
              </div>
            </div>
          </div>

          {/* Right Block — Mission Statement with image */}
          <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: '#1A1A1A' }}>
            <img
              src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/2f5f4085f_generated_image.png"
              alt="Israeli volunteers preparing food packages at community kitchen"
              className="w-full h-48 object-cover"
            />
            <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
              <h3 className="font-bold text-2xl md:text-3xl mb-5 leading-tight" style={{ color: '#fff', fontFamily: 'Georgia, serif' }}>
                CIRCLES OF GIVING
              </h3>
              <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Is a vibrant, expanding community of members who want to make meaningful changes in their lives
                individually &amp; collectively — by giving and sharing their unique talents, skills + passion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}