import { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { format, subMonths, startOfMonth, parseISO, isWithinInterval, endOfMonth } from 'date-fns';
import { Clock, TrendingUp, Users, Award } from 'lucide-react';

const CAUSE_COLORS = {
  'Transportation & Escort': '#3b82f6',
  'Combating Loneliness': '#f97316',
  'Food Preparation & Delivery': '#eab308',
  'Technological Assistance': '#6366f1',
  'Maintenance & Home Repair': '#6b7280',
  'Learning & Skills Workshops': '#22c55e',
  'Trauma & Emotional Support': '#ec4899',
  'Community Events': '#a855f7',
  'Other': '#14b8a6',
};

const PIE_COLORS = Object.values(CAUSE_COLORS);

function StatBadge({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="font-display text-3xl font-bold leading-none">{value}</p>
        <p className="text-sm font-medium text-foreground mt-1">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function ImpactDashboard({ hourLogs = [], profiles = [], events = [], posts = [] }) {
  // ── Hours logged per month (last 6 months) ──────────────────────────────
  const monthlyHours = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(new Date(), 5 - i);
      return { month: format(d, 'MMM yy'), start: startOfMonth(d), end: endOfMonth(d), hours: 0, volunteers: new Set() };
    });
    hourLogs.forEach(log => {
      if (!log.date) return;
      const d = parseISO(log.date);
      const bucket = months.find(m => isWithinInterval(d, { start: m.start, end: m.end }));
      if (bucket) {
        bucket.hours += log.hours || 0;
        if (log.user_id) bucket.volunteers.add(log.user_id);
      }
    });
    return months.map(m => ({ month: m.month, hours: Math.round(m.hours), volunteers: m.volunteers.size }));
  }, [hourLogs]);

  // ── Hours by cause ───────────────────────────────────────────────────────
  const byCause = useMemo(() => {
    const map = {};
    hourLogs.forEach(log => {
      const c = log.cause_category || 'Other';
      map[c] = (map[c] || 0) + (log.hours || 0);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [hourLogs]);

  // ── Events per month (last 6) ────────────────────────────────────────────
  const monthlyEvents = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(new Date(), 5 - i);
      return { month: format(d, 'MMM yy'), start: startOfMonth(d), end: endOfMonth(d), count: 0, rsvps: 0 };
    });
    events.forEach(evt => {
      if (!evt.created_date) return;
      const d = parseISO(evt.created_date);
      const bucket = months.find(m => isWithinInterval(d, { start: m.start, end: m.end }));
      if (bucket) {
        bucket.count += 1;
        bucket.rsvps += evt.attendees?.length || 0;
      }
    });
    return months.map(m => ({ month: m.month, events: m.count, rsvps: m.rsvps }));
  }, [events]);

  // ── Top-level KPIs ───────────────────────────────────────────────────────
  const totalHours = Math.round(hourLogs.reduce((s, l) => s + (l.hours || 0), 0));
  const activeVolunteers = profiles.filter(p => (p.total_hours || 0) > 0).length;
  const avgHours = activeVolunteers ? Math.round(totalHours / activeVolunteers) : 0;
  const totalRSVPs = events.reduce((s, e) => s + (e.attendees?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBadge icon={Clock} label="Total Community Hours" value={`${totalHours}h`} sub="All time" color="bg-accent" />
        <StatBadge icon={Users} label="Active Volunteers" value={activeVolunteers} sub="With logged hours" color="bg-blue-500" />
        <StatBadge icon={Award} label="Avg Hours / Volunteer" value={`${avgHours}h`} sub="Among active members" color="bg-purple-500" />
        <StatBadge icon={TrendingUp} label="Total RSVPs" value={totalRSVPs} sub="Across all events" color="bg-green-500" />
      </div>

      {/* Hours trend */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-display text-lg font-bold mb-1">Community Hours — Last 6 Months</h3>
        <p className="text-xs text-muted-foreground mb-5">Total volunteer hours logged per month</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyHours} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(171,45%,52%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(171,45%,52%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontSize: 12 }}
              formatter={(v) => [`${v}h`, 'Hours']}
            />
            <Area type="monotone" dataKey="hours" stroke="hsl(171,45%,52%)" strokeWidth={2} fill="url(#hoursGrad)" dot={{ r: 3, fill: 'hsl(171,45%,52%)' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two-column row: events + cause breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Events & RSVPs */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-display text-lg font-bold mb-1">Events & Participation</h3>
          <p className="text-xs text-muted-foreground mb-5">Events created and RSVPs per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyEvents} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="events" name="Events" fill="hsl(25,85%,52%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rsvps" name="RSVPs" fill="hsl(171,45%,52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hours by cause (pie) */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-display text-lg font-bold mb-1">Hours by Cause</h3>
          <p className="text-xs text-muted-foreground mb-4">Where the community spends its time</p>
          {byCause.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">No hours logged yet</div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={byCause} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                    {byCause.map((entry, i) => (
                      <Cell key={i} fill={CAUSE_COLORS[entry.name] || PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontSize: 12 }}
                    formatter={(v) => [`${v}h`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5 overflow-hidden">
                {byCause.slice(0, 6).map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CAUSE_COLORS[entry.name] || PIE_COLORS[i] }} />
                    <span className="truncate text-muted-foreground">{entry.name}</span>
                    <span className="ml-auto font-semibold text-foreground whitespace-nowrap">{entry.value}h</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active volunteers trend */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-display text-lg font-bold mb-1">Active Volunteers per Month</h3>
        <p className="text-xs text-muted-foreground mb-5">Unique volunteers who logged hours each month</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={monthlyHours} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', fontSize: 12 }}
              formatter={(v) => [v, 'Volunteers']}
            />
            <Bar dataKey="volunteers" name="Volunteers" fill="hsl(260,45%,62%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}