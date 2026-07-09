import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const FALLBACK_EVENTS = [
  {
    id: 'fallback-1',
    title: 'Evening Knitting & Crochet',
    tag: 'CRAFT CIRCLE',
    location: 'Jerusalem',
    date_label: 'THU 5',
    time: '7:00 PM',
    joining: 12,
    btnColor: '#2563EB',
    image_url: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/4cc406591_generated_image.png',
  },
  {
    id: 'fallback-2',
    title: 'Communal Shabbat Dinner',
    tag: 'SHABBAT',
    location: 'Tel Aviv',
    date_label: 'FRI 6',
    time: '6:30 PM',
    joining: 4,
    btnColor: '#A85573',
    image_url: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/3468ee4d4_generated_image.png',
  },
  {
    id: 'fallback-3',
    title: "Women's Healing & Movement",
    tag: 'HEALING',
    location: 'Haifa',
    date_label: 'SUN 8',
    time: '10:00 AM',
    joining: 8,
    btnColor: '#0F766E',
    image_url: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/46292aca1_generated_image.png',
  },
];

const AVATAR_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#e8e2d6"/><text x="50%" y="50%" font-family="Georgia,serif" font-size="28" fill="#9a8c6a" text-anchor="middle" dominant-baseline="middle">Circles of Giving</text></svg>'
  );

export default function UpcomingCirclesSection() {
  const [events, setEvents] = useState(FALLBACK_EVENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const evts = await base44.entities.Event.filter({ status: 'upcoming' }, 'date', 3);
        if (mounted && evts && evts.length > 0) {
          const tagMap = {
            Companionship: 'COMMUNITY',
            Food: 'SHABBAT',
            Home: 'HOME',
            'Skill Sharing': 'CRAFT CIRCLE',
            Technology: 'TECH',
            Transportation: 'TRANSPORT',
          };
          const btnColors = ['#2563EB', '#A85573', '#0F766E'];
          const mapped = evts.slice(0, 3).map((e, i) => {
            const d = e.date ? new Date(e.date) : null;
            const day = d ? d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() : '';
            const dayNum = d ? d.getDate() : '';
            return {
              id: e.id,
              title: e.title,
              tag: tagMap[e.cause_category] || 'EVENT',
              location: e.location || 'Israel',
              date_label: `${day} ${dayNum}`,
              time: d ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '',
              joining: e.attendees?.length || 0,
              btnColor: btnColors[i % 3],
              image_url: e.image_url || FALLBACK_EVENTS[i % 3].image_url,
            };
          });
          setEvents(mapped);
        }
      } catch {
        // keep fallback
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section style={{ background: '#F9F9F9' }}>
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <span className="text-xs font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: '#D95D1A' }}>
          THIS WEEK
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 font-heading" style={{ color: '#1A1A1A' }}>
          Upcoming Circles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {events.map((event) => (
            <div key={event.id} className="rounded-2xl overflow-hidden bg-white transition-all hover:shadow-xl hover:-translate-y-1" style={{ border: '1px solid #C99738', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; }} />
                <div className="absolute top-3 right-3 bg-white rounded-lg px-2.5 py-1 text-xs font-bold" style={{ color: '#1A1A1A' }}>
                  {event.date_label}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wide mb-1.5 block" style={{ color: '#C99738' }}>
                  {event.tag}
                </span>
                <h3 className="font-bold text-base mb-2" style={{ color: '#1A1A1A' }}>{event.title}</h3>
                <div className="flex items-center gap-1 text-xs mb-3" style={{ color: '#555' }}>
                  <MapPin className="w-3 h-3" style={{ color: '#C99738' }} />
                  <span>{event.location} · {event.time}</span>
                </div>

                {/* Avatars + joining */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex -space-x-2">
                    {AVATAR_COLORS.slice(0, 3).map((c, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: '#555' }}>+{event.joining} joining</span>
                </div>

                {/* RSVP Button */}
                <Link
                  to="/events"
                  className="block text-center text-sm font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity text-white shadow-sm"
                  style={{ background: '#D95D1A' }}
                >
                  RSVP
                </Link>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </section>
  );
}