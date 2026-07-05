import { Link } from 'react-router-dom';

const VOLUNTEERS = [
  {
    name: 'ג’וי',
    quote: '“שמי ג’וי וכל חיי התהפכו לאחר המהפכה באיראן. באתי ממשפחה אמידה וחייתי חיי מותרות.',
    img: 'https://circlesofgiving.org/wp-content/uploads/2025/01/%D7%92%D7%95%D7%99-%D7%94%D7%9E%D7%9C%D7%A6%D7%94-1.jpg',
    link: 'https://circlesofgiving.org/%d7%92%d7%95%d7%99/'
  },
  {
    name: 'איתן',
    quote: '“אני חייל מילואים שתקוע בגבול לבנון בשמונת החודשים האחרונים. היה קר מאוד. אנחנו ישנים על...',
    img: 'https://circlesofgiving.org/wp-content/uploads/2025/01/%D7%97%D7%99%D7%99%D7%9C-%D7%94%D7%9E%D7%9C%D7%A6%D7%94-1.jpg',
    link: 'https://circlesofgiving.org/%d7%90%d7%99%d7%aa%d7%9f/'
  },
  {
    name: 'יוסף',
    quote: '“כשהמלחמה התחילה, רק “מעגלי נתינה” דאגו לי. ציפיתי לנעמי, המתנדבת שתבוא עם החיוך הגדול...',
    img: 'https://circlesofgiving.org/wp-content/uploads/2025/01/%D7%99%D7%95%D7%A1%D7%A3-%D7%94%D7%9E%D7%9C%D7%A6%D7%94-1.jpg',
    link: 'https://circlesofgiving.org/%d7%99%d7%95%d7%a1%d7%a3/'
  },
  {
    name: 'אברהם',
    quote: 'היה לי הכבוד להתנדב במעגלי נתינה ולעזור בחלוקת אוכל בזמן המלחמה לאנשים בצפת. זה מרגש...',
    img: 'https://circlesofgiving.org/wp-content/uploads/2024/12/%D7%90%D7%91%D7%A8%D7%94%D7%9D-%D7%9E%D7%AA%D7%A0%D7%93%D7%91-1.jpg',
    link: 'https://circlesofgiving.org/%d7%90%d7%91%d7%a8%d7%94%d7%9d/'
  }
];

export default function VolunteerOfTheWeekSection() {
  return (
    <section className="bg-gray-50 py-12 md:py-20" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-3 block">
            המלצות ועדויות
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 font-display">
            רגעים שמרגש לשתף 💛
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            הייתם חלק מחיבור מיוחד? השתתפתם בהתנדבות שנגעה בלב? אנחנו מזמינים אתכם לשתף אותנו ברגעים הקטנים והגדולים שמילאו אתכם במשמעות.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VOLUNTEERS.map((volunteer, index) => (
            <a 
              key={index}
              href={volunteer.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={volunteer.img} 
                  alt={volunteer.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-4 right-4 text-white text-xl font-bold">
                  {volunteer.name}
                </h3>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                  {volunteer.quote}
                </p>
                <span className="text-brand-orange text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  המשך לקרוא <span aria-hidden="true">←</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}