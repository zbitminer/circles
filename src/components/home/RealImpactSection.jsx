import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function RealImpactSection() {
  const { t } = useLanguage();
  return (
    <section className="bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          <Link to="/opportunities" aria-label={t('Start Giving In Your City')} className="relative block lg:col-span-5 min-h-[220px] md:min-h-[260px] focus-visible:ring-2 focus-visible:ring-ring">
            <img
              src="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/f3f10b37d_generated_image.png"
              alt="Israeli community gathering sharing food outdoors in Safed"
              width="720"
              height="720"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-brand-gold/60 bg-black/75 p-4 backdrop-blur-sm">
              <p className="text-sm font-semibold leading-relaxed text-white">
                {t('“Giving is not only what we deliver — it is the relationship we build at every door.”')}
              </p>
            </div>
          </Link>

          <div className="lg:col-span-7 p-6 md:p-10 lg:p-12">
            




            

            <h2 className="max-w-xl text-3xl md:text-5xl font-extrabold leading-tight text-foreground text-balance">
              {t('A Hot Meal Is Also A')} <span className="text-primary">{t('Hello.')}</span>
            </h2>

            <p className="mt-5 max-w-2xl text-base md:text-lg leading-8 text-muted-foreground">
              {t('Every week, Circles members bring food, warmth, and presence to neighbours who need it most. This is what giving looks like — not just a donation, but a knock on the door and a familiar smile.')}
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-secondary p-4">
                <p className="text-2xl font-extrabold text-primary">{t('Food')}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t('Practical care')}</p>
              </div>
              <div className="rounded-2xl border border-border bg-secondary p-4">
                <p className="text-2xl font-extrabold text-primary">{t('Warmth')}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t('Human presence')}</p>
              </div>
              <div className="rounded-2xl border border-border bg-secondary p-4">
                <p className="text-2xl font-extrabold text-primary">{t('Belonging')}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t('Lasting circles')}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/opportunities"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-lg transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                
                {t('Start Giving In Your City')} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-extrabold text-foreground transition-colors duration-200 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                
                {t('Learn Our Mission')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>);

}