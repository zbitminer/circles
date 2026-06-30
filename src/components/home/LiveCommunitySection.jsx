import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const ACTIVITY_TYPES = [
  { key: 'giving', label: 'GIVING', color: '#3D9E9E', btnLabel: 'Offer', btnColor: '#3D9E9E' },
  { key: 'receiving', label: 'RECEIVING', color: '#A34A59', btnLabel: 'Ask', btnColor: '#A34A59' },
  { key: 'joining', label: 'JOINING', color: '#4A76B8', btnLabel: 'Join', btnColor: '#4A76B8' },
];

const FALLBACK_ACTIVITIES = [
  { name: 'Miriam R.', type: 'giving', desc: 'Offering 2hrs career coaching for new graduates', time: '3 min ago', location: 'Safed', link: '/opportunities' },
  { name: 'David K.', type: 'receiving', desc: 'Needs a ride to a medical appointment Thursday', time: '12 min ago', location: 'Tel Aviv', link: '/sos' },
  { name: 'Sarah L.', type: 'joining', desc: 'Joining Communal Shabbat Dinner this Friday', time: '25 min ago', location: 'Jerusalem', link: '/events' },
];

function getInitial(name) {
  return (name || '?').charAt(0).toUpperCase();
}

export default function LiveCommunitySection() {
  const [activities, setActivities] = useState(FALLBACK_ACTIVITIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const opps = await base44.entities.Opportunity.filter({ status: 'active' }, '-created_date', 3);
        if (mounted && opps && opps.length > 0) {
          const mapped = opps.slice(0, 3).map((o, i) => ({
            name: o.created_by_name || 'Community Member',
            type: ACTIVITY_TYPES[i % 3].key,
            desc: o.title || 'Community offering',
            time: 'Recently',
            location: o.location || 'Israel',
            link: '/opportunities',
          }));
          setActivities(mapped);
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
    <section className="bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: '#D95D1A' }}>
          LIVE COMMUNITY
        </span>
        <h2 className="text-3xl md:text-4xl font-bold italic mb-3" style={{ color: '#1A1A1A', fontFamily: 'Georgia, serif' }}>
          Happening right now
        </h2>
        <p className="text-base mb-10" style={{ color: '#555' }}>
          Your neighbours are giving and receiving in real time. Join the circle.
        </p>

        <div className="text-left">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block" style={{ color: '#C99738' }}>
            HAPPENING NOW
          </span>

          <div className="space-y-4">
            {activities.map((act, i) => {
              const typeConfig = ACTIVITY_TYPES.find((t) => t.key === act.type) || ACTIVITY_TYPES[0];
              return (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md" style={{ background: '#fff', border: '1px solid #C99738', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-sm"
                    style={{ background: typeConfig.color }}
                  >
                    {getInitial(act.name)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-sm" style={{ color: '#1A1A1A' }}>{act.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,151,56,0.12)', color: '#C99738' }}>
                        {typeConfig.label}
                      </span>
                    </div>
                    <p className="text-sm truncate" style={{ color: '#555' }}>{act.desc}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#888' }}>{act.time} · {act.location}</p>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={act.link}
                    className="flex-shrink-0 text-xs font-bold px-5 py-2 rounded-full hover:opacity-90 transition-opacity text-white"
                    style={{ background: typeConfig.btnColor }}
                  >
                    {typeConfig.btnLabel}
                  </Link>
                </div>
              );
            })}
          </div>

          {loading && (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}