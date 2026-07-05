import { Link } from 'react-router-dom';
import { Award, Heart } from 'lucide-react';

export default function VolunteerOfTheWeekSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10 md:py-16">
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl" style={{ border: '1px solid #f0f0f0' }}>
        <div className="flex flex-col md:flex-row">
          
          {/* Image/Avatar Side */}
          <div className="md:w-2/5 relative">
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-white/50">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">Volunteer of the Week</span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" 
              alt="Volunteer of the Week" 
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/* Content Side */}
          <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-teal/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color: '#1A1A1A' }}>Sarah Jenkins</h3>
            <p className="text-brand-orange font-semibold mb-6 flex items-center gap-2">
              <Heart className="w-4 h-4" /> 120+ Hours Volunteered
            </p>
            
            <p className="text-gray-600 leading-relaxed mb-8 italic relative z-10">
              "Sarah has been an absolute pillar of our companionship program. She consistently goes above and beyond, organizing weekly community walks and bringing incredible energy to every event she attends. Her dedication reminds us all why we started this journey."
            </p>
            
            <div>
              <Link 
                to="/directory" 
                className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5" 
                style={{ background: '#f8f9fa', color: '#333', border: '1px solid #e0e0e0' }}
              >
                Meet Our Volunteers
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}