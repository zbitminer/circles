import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function ImpactStats() {
  const [stats, setStats] = useState({ volunteers: 0, hours: 0, events: 0, opportunities: 0 });

  useEffect(() => {
    const load = async () => {
      const [profiles, logs, events, opps] = await Promise.all([
        base44.entities.VolunteerProfile.list(undefined, 500),
        base44.entities.HourLog.list(undefined, 500),
        base44.entities.Event.list(undefined, 500),
        base44.entities.Opportunity.list(undefined, 500),
      ]);
      setStats({
        volunteers: profiles.length,
        hours: Math.round(logs.reduce((s, l) => s + (l.hours || 0), 0)),
        events: events.filter(e => e.status !== 'cancelled').length,
        opportunities: opps.filter(o => o.status === 'active').length,
      });
    };
    load().catch(() => {});
  }, []);

  const items = [
    { value: stats.volunteers, label: 'Community Members', emoji: '👥' },
    { value: `${stats.hours}+`, label: 'Volunteer Hours', emoji: '⏱️' },
    { value: stats.events, label: 'Events Hosted', emoji: '📅' },
    { value: stats.opportunities, label: 'Active Opportunities', emoji: '🌱' },
  ];

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-center text-primary-foreground/70 text-sm font-medium uppercase tracking-widest mb-8">Our Community Impact</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {items.map(({ value, label, emoji }) => (
            <div key={label}>
              <div className="text-3xl mb-1">{emoji}</div>
              <p className="font-display text-4xl font-bold text-white">{value}</p>
              <p className="text-primary-foreground/70 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}