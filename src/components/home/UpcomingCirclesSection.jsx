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
    image_url: 'https://images.unsplash.com/photo-1610725664285-7c57e8a1f1e8?w=600&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=600&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80',
  },
];

const AVATAR_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

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
      <div className="max-w-5xl mx-auto px-6 py-16">
        <span className="text-xs font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: '#5A5A5A' }}>
          THIS WEEK
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#111827', fontFamily: 'Georgia, serif' }}>
          Upcoming Circles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="rounded-2xl overflow-hidden bg-white shadow-sm border" style={{ borderColor: '#eee' }}>
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white rounded-lg px-2.5 py-1 text-xs font-bold" style={{ color: '#111827' }}>
                  {event.date_label}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wide mb-1.5 block" style={{ color: event.btnColor }}>
                  {event.tag}
                </span>
                <h3 className="font-bold text-base mb-2" style={{ color: '#111827' }}>{event.title}</h3>
                <div className="flex items-center gap-1 text-xs mb-3" style={{ color: '#6b7280' }}>
                  <MapPin className="w-3 h-3" />
                  <span>{event.location} · {event.time}</span>
                </div>

                {/* Avatars + joining */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex -space-x-2">
                    {AVATAR_COLORS.slice(0, 3).map((c, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: '#6b7280' }}>+{event.joining} joining</span>
                </div>

                {/* RSVP Button */}
                <Link
                  to="/events"
                  className="block text-center text-sm font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity text-white"
                  style={{ background: event.btnColor }}
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