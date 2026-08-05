const TESTIMONIALS = [
  {
    name: 'Avraham',
    quote: 'Volunteering to distribute food during the war in Safed was one of the most moving experiences of my life. Every delivery reminded me that small acts of giving change everything.',
    role: 'Food distribution volunteer, Safed',
    emoji: '🍞',
  },
  {
    name: 'Yosef',
    quote: 'During the hardest months, volunteer Naomi came to me every week. I was not alone. The circle held me.',
    role: 'Elderly recipient, northern Israel',
    emoji: '🤝',
  },
  {
    name: 'Eitan',
    quote: 'Eight months at the Lebanese border in the cold. The organization sent us warmth — not just supplies, but people who cared.',
    role: 'IDF reservist',
    emoji: '🎖️',
  },
  {
    name: 'Joy',
    quote: 'I came from Iran with nothing. This community gave me a home, skills, and belonging. I give back now because I remember what it felt like to receive.',
    role: 'Community member & volunteer',
    emoji: '🌸',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-muted">
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">Stories from the Circle</span>
          <h2 className="font-display text-2xl font-bold text-foreground">Real People. Real Impact.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
              <div className="text-3xl">{t.emoji}</div>
              <p className="text-foreground text-sm leading-relaxed italic flex-1">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-sm text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}