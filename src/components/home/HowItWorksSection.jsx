import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const STEPS = [
{
  num: '01',
  title: 'Create your free profile',
  desc: "Tell us what you have to give and what you need. It takes 2 minutes and it's completely free — forever."
},
{
  num: '02',
  title: 'Browse or get matched',
  desc: 'Explore hundreds of live offerings or let our smart matching surface exactly what your community has for you.'
},
{
  num: '03',
  title: 'Connect and give',
  desc: 'One message starts it all. Every exchange — no matter how small — strengthens the circle for everyone.'
}];


export default function HowItWorksSection() {
  return (
    <section id="how-it-works" style={{ background: '#F5F3EF', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#D95D1A' }}>
            HOW IT WORKS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: '#1A1A1A', fontFamily: 'Georgia, serif' }}>
            Three steps. <span className="italic" style={{ color: '#247D7D' }}>Infinite impact.</span>
          </h2>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {STEPS.map((step, i) =>
          <div key={step.num} className="relative flex flex-col p-5 md:p-6 rounded-2xl transition-all hover:shadow-lg" style={{ background: '#fff', border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-sm font-bold" style={{ color: '#C99738' }}>{step.num}</span>
                <h3 className="font-bold text-2xl [font-family:'Bebas_Neue',_system-ui]" style={{ color: '#1A1A1A' }}>{step.title}</h3>
              </div>
              <p className="leading-relaxed [font-family:'Bebas_Neue',_system-ui] text-2xl" style={{ color: '#555' }}>
                {step.desc}
              </p>
              {i < STEPS.length - 1 &&
            <div className="hidden md:flex items-center absolute top-2 -right-3">
                  <ArrowRight className="w-4 h-4" style={{ color: '#C99738' }} />
                </div>
            }
            </div>
          )}
        </div>

        <div className="mt-10">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
            style={{ background: '#D95D1A', color: '#fff' }}>
            
            Get started — it's free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>);

}