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
          <span className="text-xs font-bold uppercase tracking-[0.2em] block mb-2" style={{ color: '#C9A84C' }}>Tributes</span>
          <h2 className="font-display text-2xl font-bold" style={{ color: '#1A2744' }}>A Legacy of Generosity</h2>
        </div>

        {/* Founding Supporters */}
        <div className="rounded-2xl p-8 mb-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <div className="flex justify-center mb-6">
            <img src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/d19942704_IMG_0125.jpg" alt="Goodwin and Geraldine Steinberg" className="w-40 h-40 rounded-full object-cover" style={{ border: '3px solid #C9A84C' }} />
          </div>
          <h3 className="font-display text-xl font-bold mb-4 text-center" style={{ color: '#1A2744' }}>
            Goodwin (Abraham ben Edward Perry) & Geraldine (Tamar bat Albert)
          </h3>
          <p className="text-sm leading-relaxed text-center max-w-2xl mx-auto" style={{ color: '#6b5c3e' }}>
            They were the founding supporters who initiated and championed the launch of New Seed Foundation's programs. They inspired their daughter, Joan (Rachel Bracha), to study urban planning and combine it with social services. They encouraged her to open the "warm and loving home" for children and helped raise donations. As an architect, Goodwin came to Israel and found the perfect building for the center. Our success over the years stems from their values — focused on the uniqueness of each individual and the importance of giving to others.
          </p>
        </div>

        {/* Taubman tribute with image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
          <div className="rounded-2xl overflow-hidden" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
            <div className="aspect-[4/3] overflow-hidden">
              <img src="https://circlesofgiving.org/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-24-at-14.46.44-892x1024.jpeg" alt="Herman P. and Sofia Taubman" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 text-center">
              <p className="font-display font-bold text-lg mb-3" style={{ color: '#1A2744' }}>Herman P. & Sofia Taubman</p>
              <p className="text-sm italic leading-relaxed" style={{ color: '#6b5c3e' }}>
                Herman P. and Sofia Taubman emigrated from Eastern Europe to the United States in the early 1900s. They settled and raised their family in Tulsa, Oklahoma. They cared deeply about Israel and the wellbeing of its citizens, and played a significant role in New Seed Foundation's projects throughout the years. We thank them for their partnership and meaningful involvement in bringing our project to fruition.
              </p>
            </div>
          </div>
          <div className="rounded-2xl p-6 flex flex-col justify-center" style={{ background: '#1A2744' }}>
            <h3 className="font-display text-lg font-bold mb-4 text-center" style={{ color: '#C9A84C' }}>With Deep Appreciation</h3>
            <p className="text-sm leading-relaxed mb-4 text-center" style={{ color: 'rgba(245,230,192,0.85)' }}>
              We deeply value our partners, whose contributions have been essential to realizing our vision:
            </p>
            <ul className="space-y-2 text-center text-sm" style={{ color: '#F5E6C0' }}>
              <li className="font-semibold">Herman P. & Sofia Taubman</li>
              <li className="font-semibold">Richard & Rhoda Goldman</li>
              <li className="font-semibold">Leah Levitas</li>
              <li className="font-semibold">Phyllis Friedman</li>
              <li className="font-semibold">Ita Adelstein</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl p-8 text-center max-w-2xl mx-auto" style={{ background: '#1A2744' }}>
          <p className="text-base leading-relaxed mb-3" style={{ color: '#C9A84C' }}>
            <span className="text-xl mr-1">✡️</span>
            Circles of Giving is proudly dedicated to the memory of <strong style={{ color: '#fff' }}>Goodwin & Geraldine</strong> and <strong style={{ color: '#fff' }}>Herman P. & Sophia Taubman</strong>.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,230,192,0.85)' }}>
            Their lives were a testament to the truth that generosity is not measured in wealth, but in the lives we touch and the love we leave behind. Their legacy of giving continues to ripple through every circle we build. May their memory be a blessing.
          </p>
        </div>
      </section>
    </div>
  );
}