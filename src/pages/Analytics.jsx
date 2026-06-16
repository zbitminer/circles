import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Download, Award, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function Analytics() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const profiles = await base44.entities.VolunteerProfile.filter({ user_id: user.id });
    setProfile(profiles[0] || null);
    const hourLogs = await base44.entities.HourLog.filter({ user_id: user.id }, '-date');
    setLogs(hourLogs);
    setLoading(false);
  };

  const totalHours = logs.reduce((sum, log) => sum + (log.hours || 0), 0);
  const totalEvents = profile?.events_attended || 0;
  const totalMeals = profile?.opportunities_completed || 0;

  const handleGenerateCertificate = async () => {
    const response = await base44.functions.invoke('generateCertificate', {
      user_name: user.full_name,
      total_hours: totalHours,
      start_date: logs.length > 0 ? logs[logs.length - 1].date : new Date().toISOString(),
      end_date: new Date().toISOString()
    });
    if (response.data?.pdf_url) {
      window.open(response.data.pdf_url, '_blank');
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p style={{ color: '#6b5c3e' }}>Please sign in to view your impact</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold" style={{ color: '#1A2744' }}>📊 Your Impact</h1>
        <p className="text-sm mt-2" style={{ color: '#6b5c3e' }}>Track your volunteer contributions</p>
      </div>

      {/* How it Works - 3 Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { step: '1', emoji: '⏱️', title: 'Log Hours', desc: 'Record your volunteer activities and hours in your profile.' },
          { step: '2', emoji: '📈', title: 'Track Progress', desc: 'See your total impact grow over time.' },
          { step: '3', emoji: '🏆', title: 'Get Recognized', desc: 'Generate certificates and earn badges for your contributions.' },
        ].map(({ step, emoji, title, desc }) => (
          <div key={step} className="flex flex-col items-center gap-2 p-4 rounded-xl text-center" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: '#1A2744', color: '#F5E6C0' }}>{step}</div>
            <div className="text-xl">{emoji}</div>
            <h3 className="font-semibold text-xs" style={{ color: '#1A2744' }}>{title}</h3>
            <p className="text-xs" style={{ color: '#6b5c3e' }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5" style={{ color: '#C9A84C' }} />
            <p className="text-sm text-muted-foreground">Total Hours</p>
          </div>
          <p className="font-display text-3xl font-bold" style={{ color: '#1A2744' }}>{totalHours}</p>
        </div>
        <div className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5" style={{ color: '#C9A84C' }} />
            <p className="text-sm text-muted-foreground">Events Attended</p>
          </div>
          <p className="font-display text-3xl font-bold" style={{ color: '#1A2744' }}>{totalEvents}</p>
        </div>
        <div className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5" style={{ color: '#C9A84C' }} />
            <p className="text-sm text-muted-foreground">Meals Attended</p>
          </div>
          <p className="font-display text-3xl font-bold" style={{ color: '#1A2744' }}>{totalMeals}</p>
        </div>
      </div>

      {/* Certificate */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold" style={{ color: '#1A2744' }}>Download Impact Certificate</h2>
            <p className="text-sm mt-1" style={{ color: '#6b5c3e' }}>Get a certificate showing your volunteer hours</p>
          </div>
          <button
            onClick={handleGenerateCertificate}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            style={{ background: '#1A2744', color: '#F5E6C0' }}
          >
            <Download className="w-4 h-4" />
            Generate PDF
          </button>
        </div>
      </div>

      {/* Hour Log History */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#C9A84C', background: '#FAF7EE' }}>
        <div className="p-6 border-b font-semibold" style={{ borderColor: '#C9A84C', color: '#1A2744' }}>
          Hour Log History
        </div>
        <div className="divide-y" style={{ divideColor: '#C9A84C' }}>
          {loading ? (
            <div className="p-6 text-center text-sm" style={{ color: '#6b5c3e' }}>Loading...</div>
          ) : logs.length === 0 ? (
            <div className="p-6 text-center text-sm" style={{ color: '#6b5c3e' }}>No hours logged yet</div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold" style={{ color: '#1A2744' }}>{log.activity_name}</p>
                  <p className="text-sm" style={{ color: '#6b5c3e' }}>{log.cause_category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold" style={{ color: '#C9A84C' }}>{log.hours} hours</p>
                  <p className="text-xs" style={{ color: '#6b5c3e' }}>{format(new Date(log.date), 'MMM d, yyyy')}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}