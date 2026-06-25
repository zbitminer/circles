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
      <section className="rounded-2xl p-8 mb-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <img src="https://circlesofgiving.org/wp-content/uploads/2025/01/%D7%92%D7%95%D7%90%D7%9F-%D7%9C%D7%95%D7%A8%D7%A0%D7%A1-%D7%94%D7%9E%D7%99%D7%99%D7%A1%D7%93%D7%AA.png" alt="Rachel Bracha (Joan) Laurence" className="w-28 h-28 rounded-full object-cover flex-shrink-0" style={{ border: '3px solid #C9A84C' }} />
        <div className="text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.15em] block mb-1" style={{ color: '#C9A84C' }}>Founder & CEO</span>
          <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#1A2744' }}>Rachel Bracha (Joan) Laurence</h3>
          <p className="text-sm leading-relaxed mb-2" style={{ color: '#6b5c3e' }}>
            Joan is a social entrepreneur and community designer with a passion for creating unique communities. She designed her first model community in Santa Clara, Silicon Valley, California. Since then, she has created unique programs in Safed for women, children, and families in crisis, including "The Loving Children's Home" (1991–1996), "The Mother's Child Healing Hostel" (1993–1996), "New Start Hostel" (1997–2006), and "One Heart for One Heart" (2006–2020).
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>
            Joan holds a Master's from Stanford in Urban Planning and Community Design, and a Master's in Psychology – Families and Human Development from Skidmore College. Circles of Giving is the culmination of her dream to foster unity through building "communities of giving" as the foundation for a healthy society.
          </p>
        </div>
      </section>

      {/* COO Bio */}
      <section className="rounded-2xl p-8 mb-10 flex flex-col sm:flex-row gap-6 items-center sm:items-start" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <img src="https://circlesofgiving.org/wp-content/uploads/2025/02/dikla-1-min.png" alt="Dikla Efron-Rachamim" className="w-28 h-28 rounded-full object-cover flex-shrink-0" style={{ border: '3px solid #C9A84C' }} />
        <div className="text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.15em] block mb-1" style={{ color: '#C9A84C' }}>COO — Chief Operating Officer</span>
          <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#1A2744' }}>Dikla Efron-Rachamim</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>
            Dikla is responsible for ongoing operations, leading organizational efficiency processes, and developing and implementing advanced work methodologies and systems. With 20 years of rich experience in the high-tech sector, she develops strategies and manages the project while maintaining accuracy and professionalism — strengthening the association's activities. Her extensive knowledge and pursuit of excellence bring a significant advantage to all areas of activity under her management.
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