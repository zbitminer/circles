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
    <section id="how-it-works" style={{ background: '#F5F3EF' }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#888' }}>
            HOW IT WORKS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: '#202020', fontFamily: 'Georgia, serif' }}>
            Three steps. <span className="italic">Infinite impact.</span>
          </h2>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {STEPS.map((step, i) =>
          <div key={step.num} className="relative flex flex-col">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-sm font-bold" style={{ color: '#bbb' }}>{step.num}</span>
                <h3 className="font-bold text-2xl [font-family:'Bebas_Neue',_system-ui]" style={{ color: '#202020' }}>{step.title}</h3>
              </div>
              <p className="leading-relaxed [font-family:'Bebas_Neue',_system-ui] text-2xl" style={{ color: '#404040' }}>
                {step.desc}
              </p>
              {i < STEPS.length - 1 &&
            <div className="hidden md:flex items-center absolute top-2 -right-3">
                  <ArrowRight className="w-4 h-4" style={{ color: '#ccc' }} />
                </div>
            }
            </div>
          )}
        </div>

        <div className="mt-10">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            style={{ background: '#1A1A1A', color: '#fff' }}>
            
            Get started — it's free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>);

}