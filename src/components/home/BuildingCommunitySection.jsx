export default function BuildingCommunitySection() {
  return (
    <section className="bg-card border-b border-border">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Left Block — Philosophy with image */}
          <div className="rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-xl border-2 border-foreground shadow-sm">
            <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/3c8f5ca06_IMG-20251021-WA0316.jpg"

            alt="Jewish Israeli women mentoring and sharing over tea"
            className="w-full aspect-[16/7] object-cover" />
            
            <div className="p-6 md:p-10 flex-1 flex flex-col justify-center bg-card">
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-2 block text-primary">
                <span className="line-through hidden" style={{ color: '#ccc' }}>THE FUTURE</span> · CONNECTION
              </span>
              <h2 className="font-bold text-2xl md:text-3xl mb-6 leading-tight text-foreground">
                BUILDING COMMUNITY THRU GIVING
              </h2>
              <div className="space-y-3">
                <p className="text-lg font-bold uppercase tracking-wide text-primary">
                  I contribute what I have
                </p>
                <p className="text-lg font-bold uppercase tracking-wide text-primary">
                  I receive what I need
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Together, we solve real social challenges — and build circles of belonging that sustain us all.
                </p>
              </div>
            </div>
          </div>

          {/* Right Block — Mission Statement with image */}
          <div className="rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-xl bg-brand-950 border-2 border-primary shadow-sm">
            <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/fe1ddf59a_IMG_0718.jpeg"

            alt="Israeli volunteers preparing food packages at community kitchen"
            className="w-full aspect-[16/7] object-cover" />
            
            <div className="p-6 md:p-10 flex-1 flex flex-col justify-center border-t-2 border-primary">
              <span className="text-xs font-bold uppercase tracking-[0.2em] mb-2 block text-brand-300">
                OUR MISSION
              </span>
              <h3 className="font-bold text-2xl md:text-3xl mb-5 leading-tight text-brand-50">
                CIRCLES OF GIVING
              </h3>
              <p className="text-base leading-relaxed text-brand-50/80">
                Is a vibrant, expanding community of members who want to make meaningful changes in their lives
                individually &amp; collectively — by giving and sharing their unique talents, skills &amp; passion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>);

}