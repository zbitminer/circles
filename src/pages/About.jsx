export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3" style={{ color: '#1A2744' }}>
          About Circles of Giving
        </h1>
        <p className="text-xl font-medium" style={{ color: '#C9A84C' }}>מעגלי נתינה</p>
        <p className="mt-5 text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#6b5c3e' }}>
          A community-driven initiative dedicated to transforming social isolation and crisis into collective strength.
          Born from the belief that true resilience is built through local, peer-to-peer connection.
        </p>
      </div>

      {/* Mission */}
      <section className="rounded-2xl p-8 mb-8" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <h2 className="font-display text-2xl font-bold mb-3" style={{ color: '#1A2744' }}>Our Mission</h2>
        <p className="text-base leading-relaxed" style={{ color: '#6b5c3e' }}>
          To foster a cohesive, supportive society by creating accessible, community-based "circles" of aid.
          We believe that by alleviating loneliness, addressing trauma, and providing practical, real-time support,
          we can ensure that no individual—whether a retiree, a single parent, or a soldier—is left to navigate hardship alone.
        </p>
      </section>

      {/* Half-Shekel Philosophy */}
      <section className="rounded-2xl p-8 mb-8 text-center" style={{ background: '#1A2744' }}>
        <div className="text-4xl mb-4">🪙</div>
        <h2 className="font-display text-2xl font-bold mb-3 text-white">The "Half-Shekel" Principle</h2>
        <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#C9A84C' }}>
          Just as each half-shekel was incomplete on its own and required a partner to form a whole, we believe that
          every individual is a vital part of a larger, life-giving structure. We are not just a charity; we are a
          network of neighbors who recognize that <strong style={{ color: '#fff' }}>we need one another to be whole.</strong>
        </p>
      </section>

      {/* What We Do */}
      <section className="mb-8">
        <h2 className="font-display text-2xl font-bold mb-6" style={{ color: '#1A2744' }}>What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              emoji: '🚚',
              title: 'Immediate Humanitarian Relief',
              desc: 'From urgent logistics and food distribution in frontline regions like Safed and the Galilee to ensuring delivery of essential supplies to those displaced.',
            },
            {
              emoji: '🧠',
              title: 'Trauma & Emotional Support',
              desc: 'Connecting those impacted by ongoing conflict with certified therapists and trauma-informed counseling through our "A Nation in Trauma" bridge.',
            },
            {
              emoji: '🤝',
              title: 'Daily Mutual Aid',
              desc: 'Our grassroots network facilitates transportation, technology assistance, home maintenance, and the Shabbat Meals initiative which reunites community members over shared tables.',
            },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
              <div className="text-3xl mb-3">{emoji}</div>
              <h3 className="font-semibold text-base mb-2" style={{ color: '#1A2744' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why We Exist */}
      <section className="rounded-2xl p-8 mb-8" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <h2 className="font-display text-2xl font-bold mb-3" style={{ color: '#1A2744' }}>Why We Exist</h2>
        <p className="text-base leading-relaxed" style={{ color: '#6b5c3e' }}>
          We exist because we know that systemic change begins at the kitchen table. When neighbors reach out to neighbors,
          we break down the walls of loneliness and trauma that threaten to divide us. We are dedicated to the principle
          that <strong style={{ color: '#1A2744' }}>compassion knows no borders</strong>—and that the most powerful impact
          happens when individuals from all walks of life choose to take action together.
        </p>
      </section>

      {/* Our Commitment */}
      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold mb-6" style={{ color: '#1A2744' }}>Our Commitment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              emoji: '📊',
              title: 'Impact-Driven',
              desc: 'We focus on measurable outcomes—from thousands of meals delivered to hundreds of trauma-support hours—ensuring your support translates into direct aid.',
            },
            {
              emoji: '🏘️',
              title: 'Community-First',
              desc: 'Our programs are designed to be run by the community, for the community, ensuring aid is both culturally sensitive and logistically effective.',
            },
            {
              emoji: '🔍',
              title: 'Transparent Stewardship',
              desc: 'We honor every contribution as a sacred trust, dedicating our resources to the frontline of need where they can do the most good.',
            },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="rounded-2xl p-6 flex flex-col items-start gap-3" style={{ background: '#fff', border: '1.5px solid #e0d5b8' }}>
              <span className="text-3xl">{emoji}</span>
              <h3 className="font-semibold text-base" style={{ color: '#1A2744' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder & Director Bio */}
      <section className="rounded-2xl p-8 mb-10 flex flex-col sm:flex-row gap-6 items-center sm:items-start" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <div className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold" style={{ background: '#1A2744', color: '#C9A84C' }}>
          R.B.
        </div>
        <div className="text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.15em] block mb-1" style={{ color: '#C9A84C' }}>Director & Founder</span>
          <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#1A2744' }}>Rachel Bracha (Joan) Laurence</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>
            A dedicated social entrepreneur since 1991, Rachel has spent over three decades designing programs that bridge gaps between diverse populations. Her vision for Circles of Giving emerged from a deep-seated belief that true community resilience relies on reciprocal relationships rather than one-way charity.
          </p>
        </div>
      </section>

      {/* Tribute Section */}
      <section className="mb-10">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] block mb-2" style={{ color: '#C9A84C' }}>In Loving Memory</span>
          <h2 className="font-display text-2xl font-bold" style={{ color: '#1A2744' }}>A Legacy of Generosity</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            { img: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/cbb4ccf68_IMG_0110.jpeg', caption: 'Geraldine Steinberg' },
            { img: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/88394047c_IMG_0111.jpeg', caption: 'Godwin Steinberg' },
          ].map(({ img, caption }) => (
            <div key={caption} className="rounded-2xl overflow-hidden text-center" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
              <div className="aspect-[4/3] overflow-hidden">
                <img src={img} alt={caption} className="w-full h-full object-cover" />
              </div>
              <p className="font-display font-bold text-base py-4 px-4" style={{ color: '#1A2744' }}>{caption}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm italic leading-relaxed mt-6 max-w-2xl mx-auto" style={{ color: '#6b5c3e' }}>
          <span className="text-xl mr-1">✡️</span>
          Circles of Giving is proudly dedicated to the memory of <strong style={{ color: '#1A2744' }}>Godwin & Geraldine Steinberg</strong> and <strong style={{ color: '#1A2744' }}>Herman P. & Sophia Taubman</strong> — a legacy of generosity that continues to inspire our commitment to the community today.
        </p>
      </section>
    </div>
  );
}