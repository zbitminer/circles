import { useMemo } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';
import { subMonths, startOfMonth, endOfMonth, format, parseISO, isWithinInterval } from 'date-fns';
import { Clock, Briefcase, Users, TrendingUp } from 'lucide-react';

function KPI({ icon: Icon, label, value, sub, bg, iconColor }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="font-display text-3xl font-bold leading-none">{value}</p>
        <p className="text-sm font-medium text-foreground mt-1">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const MONTHS = 12;

export default function MonthlyImpactCharts({ hourLogs = [], opportunities = [], events = [] }) {
  const monthBuckets = useMemo(() =>
    Array.from({ length: MONTHS }, (_, i) => {
      const d = subMonths(new Date(), MONTHS - 1 - i);
      return {
        month: format(d, 'MMM yy'),
        start: startOfMonth(d),
        end: endOfMonth(d),
        hours: 0,
        opps: 0,
        attendance: 0,
      };
    }), []);

  const monthly = useMemo(() => {
    const buckets = monthBuckets.map(b => ({ ...b }));

    // Volunteer hours by log date
    hourLogs.forEach(log => {
      if (!log.date) return;
      const d = parseISO(log.date);
      const b = buckets.find(m => isWithinInterval(d, { start: m.start, end: m.end }));
      if (b) b.hours = Math.round(b.hours + (log.hours || 0));
    });

    // Completed opportunities by created_date
    opportunities.forEach(opp => {
      if (opp.status !== 'closed' && opp.status !== 'active') return;
      const raw = opp.created_date;
      if (!raw) return;
      const d = parseISO(raw);
      const b = buckets.find(m => isWithinInterval(d, { start: m.start, end: m.end }));
      if (b) b.opps += 1;
    });

    // Event attendance (sum of attendees) by event date
    events.forEach(evt => {
      const raw = evt.date || evt.created_date;
      if (!raw) return;
      const d = parseISO(raw);
      const b = buckets.find(m => isWithinInterval(d, { start: m.start, end: m.end }));
      if (b) b.attendance += evt.attendees?.length || 0;
    });

    return buckets.map(({ month, hours, opps, attendance }) => ({ month, hours, opps, attendance }));
  }, [hourLogs, opportunities, events, monthBuckets]);

  const totalHours = hourLogs.reduce((s, l) => s + (l.hours || 0), 0);
  const totalOpps = opportunities.length;
  const totalAttendance = events.reduce((s, e) => s + (e.attendees?.length || 0), 0);
  const peakHoursMonth = [...monthly].sort((a, b) => b.hours - a.hours)[0];

  const tooltipStyle = { borderRadius: 12, border: '1px solid hsl(var(--border))', fontSize: 12 };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI icon={Clock} label="Total Hours" value={`${Math.round(totalHours)}h`} sub="All logged volunteer hours" bg="bg-accent/15" iconColor="text-accent" />
        <KPI icon={Briefcase} label="Opportunities" value={totalOpps} sub="Created on platform" bg="bg-primary/10" iconColor="text-primary" />
        <KPI icon={Users} label="Total Attendance" value={totalAttendance} sub="RSVPs across all events" bg="bg-blue-100" iconColor="text-blue-600" />
        <KPI icon={TrendingUp} label="Peak Month" value={peakHoursMonth?.hours ? `${peakHoursMonth.hours}h` : '—'} sub={peakHoursMonth?.month || ''} bg="bg-purple-100" iconColor="text-purple-600" />
      </div>

      {/* Combined monthly overview */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-display text-lg font-bold mb-1">Monthly Impact Overview — Last 12 Months</h3>
        <p className="text-xs text-muted-foreground mb-5">Volunteer hours (bars) vs. event attendance (line)</p>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={monthly} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => name === 'hours' ? [`${v}h`, 'Hours'] : [v, name === 'attendance' ? 'Attendance' : 'Opportunities']} />
            <Legend wrapperStyle={{ fontSize: 11 }} formatter={n => n === 'hours' ? 'Volunteer Hours' : n === 'attendance' ? 'Event Attendance' : 'Opportunities'} />
            <Bar yAxisId="left" dataKey="hours" fill="hsl(171,45%,52%)" radius={[4,4,0,0]} name="hours" />
            <Bar yAxisId="left" dataKey="opps" fill="hsl(150,45%,30%)" radius={[4,4,0,0]} name="opps" />
            <Line yAxisId="right" type="monotone" dataKey="attendance" stroke="hsl(220,80%,60%)" strokeWidth={2} dot={{ r: 3 }} name="attendance" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volunteer Hours area chart */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-display text-lg font-bold mb-1">Volunteer Hours Trend</h3>
        <p className="text-xs text-muted-foreground mb-5">Total hours logged per month</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthly} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="hoursGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(171,45%,52%)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(171,45%,52%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={v => [`${v}h`, 'Hours']} />
            <Area type="monotone" dataKey="hours" stroke="hsl(171,45%,52%)" strokeWidth={2} fill="url(#hoursGrad2)" dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Opportunities & Attendance side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-display text-lg font-bold mb-1">Opportunities per Month</h3>
          <p className="text-xs text-muted-foreground mb-5">New opportunities posted each month</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthly} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="oppsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(150,45%,30%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(150,45%,30%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => [v, 'Opportunities']} />
              <Area type="monotone" dataKey="opps" stroke="hsl(150,45%,30%)" strokeWidth={2} fill="url(#oppsGrad)" dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-display text-lg font-bold mb-1">Event Attendance per Month</h3>
          <p className="text-xs text-muted-foreground mb-5">Total RSVPs across events each month</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthly} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220,80%,60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(220,80%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => [v, 'Attendees']} />
              <Area type="monotone" dataKey="attendance" stroke="hsl(220,80%,60%)" strokeWidth={2} fill="url(#attendGrad)" dot={{ r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}