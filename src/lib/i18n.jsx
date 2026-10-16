import { createContext, useContext, useEffect, useState } from 'react';

const HE = {
  'Home': 'בית',
  'About': 'אודות',
  'Community': 'קהילה',
  'Events': 'אירועים',
  'Hosting': 'אירוח',
  'Workshops': 'סדנאות',
  'Give': 'לתת',
  'Receive': 'לקבל',
  'Belong': 'להשתייך',
  'Opportunities': 'התנדבויות',
  'Corporate Volunteering': 'התנדבות תאגידית',
  'Browse & apply for volunteer roles': 'עיינו והגישו מועמדות לתפקידי התנדבות',
  'Team-building with impact': 'גיבוש צוות עם משמעות',
  'Shabbat & Holidays': 'שבת וחגים',
  'Host or join a Shabbat or holiday table': 'אירחו או הצטרפו לשולחן שבת או חג',
  'Health Support': 'תמיכה בריאותית',
  'Health & wellness requests': 'בקשות בריאות ורווחה',
  'Find support & services': 'מצאו תמיכה ושירותים',
  'My Profile': 'הפרופיל שלי',
  'Your volunteer identity': 'הזהות המתנדבת שלך',
  'Directory': 'מדריך חברים',
  'Discover fellow volunteers': 'הכירו מתנדבים נוספים',
  'Gallery': 'גלריה',
  'Photos from our community': 'תמונות מהקהילה שלנו',
  'Community Chat': 'צ׳אט קהילתי',
  'Group chat with all members': 'צ׳אט קבוצתי עם כל החברים',
  'Messages': 'הודעות',
  'Private conversations': 'שיחות פרטיות',
  'Impact': 'תרומה',
  'Track your contribution': 'עקבו אחר התרומה שלכם',
  'Circles of Giving': 'מעגלי נתינה',
  'I Give. I Receive. I Belong.': 'אני נותן. אני מקבל. אני שייך.',
  'Login': 'התחברות',
  'Register Now →': '← הרשמו עכשיו',
  'Admin': 'ניהול',
  'Profile': 'פרופיל',
  'Logout': 'התנתקות',
  'Quick Links': 'קישורים מהירים',
  'Contact': 'צור קשר',
  'Donate': 'תרומה',
  'Urgent': 'דחוף',
  'Trust': 'אמון',
  'Health & Wellness': 'בריאות ורווחה',
  'Platform Overview': 'סקירת המיזם',
  'Sitemap': 'מפת אתר',
  'Privacy Policy': 'מדיניות פרטיות',
  'Terms of Use': 'תנאי שימוש',
  'All rights reserved.': 'כל הזכויות שמורות.',
  'A community that brings together people who want to create change and make an impact — through caring, collaboration, and mutual aid.':
    'קהילה שמחברת בין אנשים שרוצים ליצור שינוי ולהשפיע — דרך אכפתיות, שיתוף פעולה וערבות הדדית.',
};

const LanguageContext = createContext({ lang: 'en', setLang: () => {}, t: (s) => s });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('cog_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('cog_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (s) => (lang === 'he' ? HE[s] || s : s);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);