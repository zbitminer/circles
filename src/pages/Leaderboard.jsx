import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Trophy, Clock, Users, Award, ArrowLeft } from 'lucide-react';

export default function Leaderboard() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.VolunteerProfile.list('-total_hours', 50)
      .then((data) => setProfiles(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">Volunteer Leaderboard</h1>
              <p className="text-sm text-muted-foreground">Recognizing our most active community members</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Top 3 Podium */}
        {!loading && profiles.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {profiles.slice(0, 3).map((p, i) => (
              <div
                key={p.id}
                className={`flex flex-col items-center text-center p-5 rounded-2xl border-2 ${
                  i === 0 ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20' :
                  i === 1 ? 'border-gray-300 bg-gray-50 dark:bg-gray-900/20' :
                  'border-orange-400 bg-orange-50 dark:bg-orange-950/20'
                }`}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2" style={{ background: medalColors[i] }}>
                  {i + 1}
                </div>
                <p className="font-bold text-sm text-foreground truncate w-full">
                  {p.bio?.split('\n')[0] || `Volunteer ${i + 1}`}
                </p>
                <p className="text-xs text-muted-foreground">{p.total_hours || 0} hrs</p>
              </div>
            ))}
          </div>
        )}

        {/* Full List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No volunteer hours logged yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {profiles.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-sm transition-shadow"
              >
                <span className={`w-8 text-center font-bold text-sm ${i < 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {i + 1}
                </span>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                  {(p.bio?.charAt(0) || 'V').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {p.bio?.split('\n')[0] || `Volunteer ${i + 1}`}
                  </p>
                  {p.location && <p className="text-xs text-muted-foreground">{p.location}</p>}
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" /> {p.total_hours || 0}h
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Award className="w-3.5 h-3.5" /> {p.opportunities_completed || 0}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3.5 h-3.5" /> {p.followers?.length || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}