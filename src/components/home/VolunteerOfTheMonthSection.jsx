import { Award, Heart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import ContentImageDetails from '@/components/content/ContentImageDetails';

export default function VolunteerOfTheMonthSection() {
  const { t } = useLanguage();
  return (
    <section className="bg-card">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Award className="w-4 h-4" /> {t('Honored Volunteer')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-3xl shadow-xl max-w-2xl md:max-h-[520px] mx-auto bg-brand-950">
          {/* Photo */}
          <div className="relative aspect-[4/3] md:aspect-auto min-h-0">
            <ContentImageDetails
              image="https://media.base44.com/images/public/6a2feeb0292b105992c98be7/984169b9e_IMG_1210.jpg"
              alt="Rachel, Volunteer of the Month"
              title={t('Rachel')}
              description={t('Honored Volunteer')}
              className="block h-full w-full"
              imageClassName="w-full h-full object-cover opacity-70"
            >
              <p className="text-sm leading-relaxed">{t('This month we honor Rachel for her tireless dedication cooking and baking for our holistic healing programs. Every dish she prepares is made with warmth, care, and love — nourishing not just the body, but the spirit of everyone she serves.')}</p>
              <p className="text-sm leading-relaxed">{t('Rachel embodies the heart of our community: giving generously, showing up consistently, and reminding us all that healing begins with kindness. Thank you, Rachel. 💛')}</p>
            </ContentImageDetails>
            
            {/* Design mask overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.75) 0%, rgba(26,26,26,0.15) 45%, rgba(234,88,12,0.20) 100%)' }} />
            

          </div>

          {/* Text */}
          <div className="flex flex-col p-5 md:p-6 min-h-0 overflow-y-auto">
            <div className="h-1.5 w-16 mb-6 bg-primary" />
            <h3 className="text-4xl md:text-5xl font-extrabold uppercase leading-none tracking-tight mb-4 text-brand-300">
              {t('Rachel')}
            </h3>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {t('This month we honor Rachel for her tireless dedication cooking and baking for our holistic healing programs. Every dish she prepares is made with warmth, care, and love — nourishing not just the body, but the spirit of everyone she serves.')}
            </p>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {t('Rachel embodies the heart of our community: giving generously, showing up consistently, and reminding us all that healing begins with kindness. Thank you, Rachel. 💛')}
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-300">
              <Heart className="w-5 h-5 fill-current" />
              {t('Baking with love for our holistic healing programs')}
            </div>
          </div>
        </div>
      </div>
    </section>);

}