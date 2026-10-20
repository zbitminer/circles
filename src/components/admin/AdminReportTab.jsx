import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { GraduationCap, Clock, Users, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <p className="font-display text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export default function AdminReportTab() {
  const [data, setData] = useState(null);
  const since = moment().subtract(30, 'days');

  useEffect(() => {
    const sinceIso = since.toISOString();
    const sinceDate = since.format('YYYY-MM-DD');
    Promise.all([
      base44.entities.WorkshopInquiry.count({ inquiry_type: 'participate', created_date: { $gte: sinceIso } }),
      base44.entities.WorkshopInquiry.count({ inquiry_type: 'lead', created_date: { $gte: sinceIso } }),
      base44.entities.WorkshopInquiry.count({ status: 'completed', created_date: { $gte: sinceIso } }),
      base44.entities.HourLog.aggregate({ query: { date: { $gte: sinceDate } }, groupBy: 'date', sum: ['hours'], sort: 'date' }),
    ]).then(([attendance, led, completed, hours]) => {
      const rows = (hours.rows || []).map((r) => ({ date: moment(r.date).format('MMM D'), hours: r.sum_hours || 0, entries: r.count }));
      setData({
        attendance, led, completed, rows,
        totalHours: rows.reduce((s, r) => s + r.hours, 0),
        entries: rows.reduce((s, r) => s + r.entries, 0),
      });
    }).catch(() => {
      setData({ attendance: 0, led: 0, completed: 0, rows: [], totalHours: 0, entries: 0 });
    });
  }, []);

  if (!data) return <div className="animate-pulse h-48 bg-card rounded-2xl border border-border" />;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Last 30 days: {since.format('MMM D')} – {moment().format('MMM D, YYYY')}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Stat icon={Users} label="Workshop attendees (sign-ups)" value={data.attendance} />
        <Stat icon={GraduationCap} label="Workshops proposed" value={data.led} />
        <Stat icon={CheckCircle} label="Workshops completed" value={data.completed} />
        <Stat icon={Clock} label="Volunteer hours logged" value={Math.round(data.totalHours * 10) / 10} />
      </div>
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6">
        <h2 className="font-display text-lg font-bold mb-1">Volunteer Hours by Day</h2>
        <p className="text-xs text-muted-foreground mb-4">{data.entries} log entries</p>
        {data.rows.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">No hours logged in the last 30 days.</p>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.rows}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10 }} width={28} />
                <Tooltip />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}