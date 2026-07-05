const SPOTLIGHTS = [
{
  name: 'Joy',
  quote: '"My name is Joy and my whole life turned upside down after the revolution in Iran. I came from a wealthy family and lived a life of luxury..."',
  img: 'https://circlesofgiving.org/wp-content/uploads/2025/01/%D7%92%D7%95%D7%99-%D7%94%D7%9E%D7%9C%D7%A6%D7%94-1.jpg',
  link: 'https://circlesofgiving.org/%d7%92%d7%95%d7%99/',
  bg: '#7E3D8D'
},
{
  name: 'Eitan',
  quote: '"I am a reserve soldier stuck on the Lebanon border for the past eight months. It was very cold. We sleep on..."',
  img: 'https://circlesofgiving.org/wp-content/uploads/2025/01/%D7%97%D7%99%D7%99%D7%9C-%D7%94%D7%9E%D7%9C%D7%A6%D7%94-1.jpg',
  link: 'https://circlesofgiving.org/%d7%90%d7%99%d7%aa%d7%9f/',
  bg: '#363840'
},
{
  name: 'Yosef',
  quote: '"When the war started, only \'Circles of Giving\' cared for me. I looked forward to Naomi, the volunteer who would come with her big smile..."',
  img: 'https://circlesofgiving.org/wp-content/uploads/2025/01/%D7%99%D7%95%D7%A1%D7%A3-%D7%94%D7%9E%D7%9C%D7%A6%D7%94-1.jpg',
  link: 'https://circlesofgiving.org/%d7%99%d7%95%d7%a1%d7%a3/',
  bg: '#0F766E'
},
{
  name: 'Avraham',
  quote: '"I had the honor to volunteer at Circles of Giving and help distribute food during the war to people in Safed. It is moving..."',
  img: 'https://circlesofgiving.org/wp-content/uploads/2024/12/%D7%90%D7%91%D7%A8%D7%94%D7%9D-%D7%9E%D7%AA%D7%A0%D7%93%D7%91-1.jpg',
  link: 'https://circlesofgiving.org/%d7%90%d7%91%d7%a8%d7%94%d7%9d/',
  bg: '#A85573'
}];


import { ArrowRight } from 'lucide-react';

export default function VolunteerSpotlightSection() {
  return (
    <section style={{ background: '#F9F9F9', borderTop: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10 items-center">
          {/* Left — Text */}
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 md:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)]" style={{ border: '1px solid #C99738' }}>
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#D95D1A' }}>REAL PEOPLE. REAL IMPACT</span>
            <h4 className="text-2xl md:text-3xl font-bold mb-4 hidden" style={{ color: '#1A1A1A', fontFamily: 'Georgia, serif' }}>
              Moments we are excited to share 💛
            </h4>
            <p className="text-sm md:text-base leading-relaxed hidden" style={{ color: '#555' }}>
              Were you part of a special connection? Did you participate in volunteering that touched your heart? We invite you to share with us the small and big moments that filled you with meaning.
            </p>
          </div>

          {/* Right — Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {SPOTLIGHTS.map((s) =>
            <a
              key={s.name}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] transition-all hover:shadow-xl hover:-translate-y-1 group block overflow-hidden border"
              style={{ borderColor: '#C99738' }}>
              
                <div className="relative aspect-square w-full bg-gray-100">
                  <img
                  src={s.img}
                  alt={s.name}
                  className="w-full h-full object-cover grayscale transition-transform duration-500 group-hover:scale-105" />
                
                </div>
                {/* Bottom Left White Box */}
                <div className="absolute bottom-0 left-0 right-14 bg-white pt-3 px-4 pb-2 border-b-[6px] rounded-tr-xl z-10" style={{ borderColor: '#1A1A1A' }}>
                  <h3 className="font-black text-xl leading-tight truncate tracking-tight" style={{ color: '#D95D1A', fontFamily: 'Inter, sans-serif' }}>
                    {s.name}
                  </h3>
                  <p className="font-bold text-sm truncate tracking-tight mt-0.5" style={{ color: '#1A1A1A', fontFamily: 'Inter, sans-serif' }}>
                    @{s.name.toLowerCase()}
                  </p>
                </div>
                {/* Bottom Right Button */}
                <div className="absolute bottom-0 right-0 w-14 h-14 flex items-center justify-center z-10" style={{ background: '#D95D1A' }}>
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>);

}