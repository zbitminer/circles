import { Link } from 'react-router-dom';

const VOLUNTEERS = [
  {
    name: 'Joy',
    quote: '"My name is Joy and my whole life turned upside down after the revolution in Iran. I came from a wealthy family and lived a life of luxury..."',
    img: 'https://circlesofgiving.org/wp-content/uploads/2025/01/%D7%92%D7%95%D7%99-%D7%94%D7%9E%D7%9C%D7%A6%D7%94-1.jpg',
    link: 'https://circlesofgiving.org/%d7%92%d7%95%d7%99/'
  },
  {
    name: 'Eitan',
    quote: '"I am a reserve soldier stuck on the Lebanon border for the past eight months. It was very cold. We sleep on..."',
    img: 'https://circlesofgiving.org/wp-content/uploads/2025/01/%D7%97%D7%99%D7%99%D7%9C-%D7%94%D7%9E%D7%9C%D7%A6%D7%94-1.jpg',
    link: 'https://circlesofgiving.org/%d7%90%d7%99%d7%aa%d7%9f/'
  },
  {
    name: 'Yosef',
    quote: '"When the war started, only \'Circles of Giving\' cared for me. I looked forward to Naomi, the volunteer who would come with her big smile..."',
    img: 'https://circlesofgiving.org/wp-content/uploads/2025/01/%D7%99%D7%95%D7%A1%D7%A3-%D7%94%D7%9E%D7%9C%D7%A6%D7%94-1.jpg',
    link: 'https://circlesofgiving.org/%d7%99%d7%95%d7%a1%d7%a3/'
  },
  {
    name: 'Avraham',
    quote: '"I had the honor to volunteer at Circles of Giving and help distribute food during the war to people in Safed. It is moving..."',
    img: 'https://circlesofgiving.org/wp-content/uploads/2024/12/%D7%90%D7%91%D7%A8%D7%94%D7%9D-%D7%9E%D7%AA%D7%A0%D7%93%D7%91-1.jpg',
    link: 'https://circlesofgiving.org/%d7%90%d7%91%d7%a8%d7%94%d7%9d/'
  }
];

export default function VolunteerOfTheWeekSection() {
  return (
    <section className="bg-gray-50 py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-3 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 font-display">
            Moments we are excited to share 💛
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Were you part of a special connection? Did you participate in volunteering that touched your heart? We invite you to share with us the small and big moments that filled you with meaning.
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
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={volunteer.img} 
                  alt={volunteer.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                  {volunteer.name}
                </h3>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                  {volunteer.quote}
                </p>
                <span className="text-brand-orange text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More <span aria-hidden="true">→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}