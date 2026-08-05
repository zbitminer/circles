import { Link } from 'react-router-dom';
import { Heart, Users, Clock, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3" style={{ color: '#1A2744' }}>
          Together, We Build a Better Reality
        </h1>
        <p className="text-xl font-medium" style={{ color: '#C9A84C' }}>מעגלי נתינה</p>
        <p className="mt-5 text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: '#6b5c3e' }}>
          Through giving, receiving, compassion, and humanity.
        </p>
      </div>

      {/* Intro */}
      <section className="mb-10">
        <p className="text-base leading-relaxed mb-5" style={{ color: '#6b5c3e' }}>
          There's a spark in every person — a quiet ability to change someone else's life for the better. Most of us just need a place to let it out.
        </p>
        <p className="text-base leading-relaxed mb-5" style={{ color: '#6b5c3e' }}>
          That's what <strong style={{ color: '#1A2744' }}>Circles of Giving</strong> is.
        </p>
        <p className="text-base leading-relaxed mb-5" style={{ color: '#6b5c3e' }}>
          We're a community in Safed built on one simple, powerful idea: give what you can, receive what you need. No résumé required. No experience necessary. Just a willingness to show up for each other. When you give here, you'll find you receive too — and when you receive, you give something back in return. That's the circle. And every person who joins makes it wider, stronger, and more able to hold the people who need it most.
        </p>
        <p className="text-base leading-relaxed" style={{ color: '#6b5c3e' }}>
          This isn't charity handed down from above. It's neighbors helping neighbors. It's real people finding real ways to matter to each other — in whatever time they have, in whatever way they're able.
        </p>
      </section>

      {/* Why We're Here */}
      <section className="rounded-2xl p-8 mb-8" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <h2 className="font-display text-2xl font-bold mb-4" style={{ color: '#1A2744' }}>Why We're Here</h2>
        <p className="text-base leading-relaxed mb-6" style={{ color: '#6b5c3e' }}>
          We started with a vision: a community where nobody has to carry their hardest moments alone, and nobody has to sit on the sidelines of their own generosity.
        </p>
        <p className="text-base leading-relaxed mb-6" style={{ color: '#6b5c3e' }}>
          So we built both a virtual platform and a physical home — our center right here in Safed — to connect people who want to give their time and talent with people who need a hand and a heart. Together, they show up for each other in a few essential ways:
        </p>
        <div className="space-y-5">
          {[
            { icon: Clock, text: 'When someone needs help right now — our emergency response reaches people within 24–48 hours. No one should have to wait alone in a crisis.' },
            { icon: Heart, text: 'When someone feels forgotten — we work to lift up disadvantaged families and individuals, and to knit the wider community closer together.' },
            { icon: Sparkles, text: 'When someone wants to grow — we offer classes, training, and tools so people of every age can learn something new and walk away with real skills.' },
            { icon: Users, text: 'When someone is hurting — we sit with people through trauma and crisis, offering a steady hand through the hardest chapters of their lives.' },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0" style={{ background: '#1A2744', color: '#C9A84C' }}>
                <Icon className="w-5 h-5" />
              </span>
              <p className="text-base leading-relaxed pt-1.5" style={{ color: '#6b5c3e' }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Heart of It All */}
      <section className="rounded-2xl p-8 mb-8 text-center" style={{ background: '#1A2744' }}>
        <h2 className="font-display text-2xl font-bold mb-4" style={{ color: '#C9A84C' }}>The Heart of It All</h2>
        <p className="text-base leading-relaxed mb-4 max-w-2xl mx-auto" style={{ color: '#F5E6C0' }}>
          Step into our center in Safed and you'll feel it immediately: this is a place that's alive. People gather in the community café. Share their stories over coffee. Everyone carries a unique spark — talent, passion, skill. Here, we illuminate each other by teaching, sharing and learning together. Meet a friend they didn't know they needed. Sit in a workshop, join an event, discover a talent they forgot they had.
        </p>
        <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(245,230,192,0.85)' }}>
          This building isn't just a headquarters. It's the beating heart of everything we do — proof that community isn't an idea, it's something you can walk into.
        </p>
      </section>

      {/* The People Behind the Vision */}
      <section className="rounded-2xl p-8 mb-10 flex flex-col sm:flex-row gap-6 items-center sm:items-start" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <div className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-bold" style={{ background: '#1A2744', color: '#C9A84C' }}>
          J.L.
        </div>
        <div className="text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.15em] block mb-1" style={{ color: '#C9A84C' }}>Founder and CEO</span>
          <h3 className="font-display text-xl font-bold mb-3" style={{ color: '#1A2744' }}>Joan Rachel Bracha Laurence</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>
            A social entrepreneur and community designer who has spent her career doing exactly one thing: building places where people heal and belong. From her first model community in Santa Clara, California, to a string of pioneering programs in Safed (from 1990) — The Loving Children's Home, The Mother Child Healing Hostel, New Beginnings Hostel for pregnant unwed mothers, to a Single Mother's Healing center — Joan has spent over three decades learning what makes a community actually work. Circles of Giving is the culmination of that life's work: a place built to foster unity by helping people give to one another.
          </p>
        </div>
      </section>

      {/* This Is Where You Come In */}
      <section className="rounded-2xl p-8 mb-8 text-center" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <h2 className="font-display text-2xl font-bold mb-4" style={{ color: '#1A2744' }}>This Is Where You Come In</h2>
        <p className="text-base leading-relaxed mb-3 max-w-2xl mx-auto" style={{ color: '#6b5c3e' }}>
          You don't need special skills. You don't need extra time you don't have. You just need to be willing to give what you can — and to let this community give something back to you.
        </p>
        <p className="text-base leading-relaxed mb-6 max-w-2xl mx-auto" style={{ color: '#6b5c3e' }}>
          Come volunteer. Come learn. Come be part of the circle.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/register" className="inline-flex items-center gap-2 font-bold text-base px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-lg" style={{ background: '#1A2744', color: '#fff' }}>
            Join us
          </Link>
          <Link to="/donate" className="inline-flex items-center gap-2 font-bold text-base px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-lg border-2" style={{ background: 'transparent', color: '#1A2744', borderColor: '#C9A84C' }}>
            <Heart className="w-4 h-4" /> Donate
          </Link>
        </div>
      </section>

      {/* Social Links */}
      <section className="text-center mb-14">
        <div className="flex items-center justify-center gap-2 text-sm flex-wrap" style={{ color: '#6b5c3e' }}>
          <Link to="/register" className="font-bold hover:underline" style={{ color: '#1A2744' }}>Join us</Link>
          <span style={{ color: '#C9A84C' }}>/</span>
          <Link to="/donate" className="font-bold hover:underline" style={{ color: '#1A2744' }}>Donate</Link>
          <span style={{ color: '#C9A84C' }}>·</span>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: '#1A2744' }}>Facebook</a>
          <span style={{ color: '#C9A84C' }}>·</span>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: '#1A2744' }}>Instagram</a>
          <span style={{ color: '#C9A84C' }}>·</span>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: '#1A2744' }}>YouTube</a>
        </div>
      </section>

      {/* Dedication */}
      <section>
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
          <div className="rounded-2xl p-6 text-center" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
            <div className="flex justify-center mb-4">
              <img src="https://circlesofgiving.org/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-24-at-14.46.44-892x1024.jpeg" alt="Herman P. and Sofia Taubman" className="w-40 h-40 rounded-full object-cover" style={{ border: '3px solid #C9A84C' }} />
            </div>
            <div>
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