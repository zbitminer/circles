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


const HANDLES = {
  Joy: '@joy_iran',
  Eitan: '@eitan_border',
  Yosef: '@yosef_war',
  Avraham: '@avraham_vol'
};

export default function VolunteerSpotlightSection() {
  return (
    <section className="bg-card">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <h2 className="text-center font-heading font-extrabold uppercase leading-none tracking-tight mb-10 md:mb-14 text-3xl text-primary">
          Real People. Real Impact.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {SPOTLIGHTS.map((s) =>
          <a
            key={s.name}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-[430px] flex-col overflow-hidden rounded-2xl bg-foreground transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            
              {/* Gold bookmark corner tab */}
              <div
              className="absolute -top-1 left-6 h-14 w-8 bg-accent"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)' }} />
            

              {/* Portrait */}
              <div className="p-3 pb-0">
                <div className="relative h-52 w-full overflow-hidden rounded-xl bg-black">
                  <img
                  src={s.img}
                  alt={s.name}
                  width="400"
                  height="400"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-1 flex-col px-4 pt-4 pb-0">
                <h3 className="font-heading font-extrabold uppercase leading-none text-3xl tracking-tight text-accent">
                  {s.name}
                </h3>
                <p className="mt-1 font-bold uppercase tracking-wide text-sm text-white/90">
                  {HANDLES[s.name] || `@${s.name.toLowerCase()}`}
                </p>
                <p className="mt-3 min-h-0 flex-1 overflow-y-auto pr-2 text-sm leading-relaxed text-white/70">
                  {s.quote.replace(/^"|"$/g, '')}
                </p>
              </div>
            </a>
          )}
        </div>
      </div>
    </section>);

}