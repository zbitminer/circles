import { Link } from 'react-router-dom';

const CARDS = [
{
  key: 'give',
  title: 'Give.',
  color: '#D35E35',
  bgTint: 'rgba(211,94,53,0.08)',
  icon: "https://media.base44.com/images/public/6a2feeb0292b105992c98be7/d00dedeea_Black_and_White_Corporate_Pitch_Presentation.png",
  description: 'Share your time, skills & resources.',
  benefit: 'Earn goodwill & build your reputation',
  cta: 'Give Now →',
  to: '/opportunities'
},
{
  key: 'receive',
  title: 'Receive.',
  color: '#247D7D',
  bgTint: 'rgba(36,125,125,0.08)',
  icon: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/30732f2b4_BlackandWhiteCorporatePitchPresentation.png',
  description: 'Find support from trusted neighbors.',
  benefit: 'Get matched with a verified helper',
  cta: 'Get Support →',
  to: '/sos'
},
{
  key: 'belong',
  title: 'Belong.',
  color: '#C99738',
  bgTint: 'rgba(201,151,56,0.08)',
  icon: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/a6d867f57_Black_and_White_Corporate_Pitch_Presentation.png',
  description: 'Connect with others & grow together.',
  benefit: 'Find your people in the community',
  cta: 'Join the Community →',
  to: '/directory'
}];


export default function WaysToEngageSection({ children }) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-10 md:mb-14">
        <span className="font-bold uppercase tracking-[0.2em] block text-2xl md:text-3xl mb-2" style={{ color: '#D95D1A' }}>
          WAYS TO ENGAGE
        </span>
        <p className="text-sm md:text-base" style={{ color: '#888' }}>
          Three paths. One community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
        {CARDS.map((card) =>
        <div
          key={card.key}
          className="group flex flex-col items-center text-center p-7 md:p-9 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1"
          style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          
            {/* Icon — consistent size across all cards */}
            <div className="flex items-center justify-center mb-5">
              <img src={card.icon} alt={card.title} className="w-36 h-36 object-contain" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: card.color, fontFamily: 'Georgia, serif' }}>
              {card.title}
            </h2>

            {/* Description — equalized to one line */}
            <p className="leading-relaxed text-base mb-1" style={{ color: '#555' }}>
              {card.description}
            </p>

            {/* Benefit line */}
            <p className="text-xs font-medium mb-6" style={{ color: card.color, opacity: 0.75 }}>
              {card.benefit}
            </p>

            {/* CTA — pinned to bottom for visual equality */}
            <Link
            to={card.to}
            className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3 rounded-full hover:opacity-90 transition-opacity mt-auto w-full justify-center"
            style={{ background: card.color, color: '#fff' }}>
            
              {card.cta}
            </Link>
          </div>
        )}
      </div>

      {children}
    </section>);

}