import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import { Flame, Users, TrendingUp } from 'lucide-react';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await base44.entities.Post.list('-created_date', 50);
    setPosts(data.filter(p => p.status !== 'removed'));
    setLoading(false);
  };

  const isMod = user?.role === 'moderator' || user?.role === 'admin';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl p-6" style={{ background: '#1A2744', border: '1px solid #C9A84C' }}>
              <h2 className="font-display text-2xl font-bold mb-2" style={{ color: '#F5E6C0' }}>I Give.<br />I Receive.<br />I Belong.</h2>
              <p className="text-sm mb-4" style={{ color: 'rgba(245,230,192,0.70)' }}>I contribute what I have. I receive what I need. Together, we build circles of belonging.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(245,230,192,0.80)' }}>
                  <Users className="w-4 h-4" style={{ color: '#C9A84C' }} />
                  <span>Vibrant community</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(245,230,192,0.80)' }}>
                  <Flame className="w-4 h-4" style={{ color: '#C9A84C' }} />
                  <span>Real social impact</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(245,230,192,0.80)' }}>
                  <TrendingUp className="w-4 h-4" style={{ color: '#C9A84C' }} />
                  <span>Grow together</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: '#1A2744' }}>Explore Causes</h3>
              <div className="flex flex-wrap gap-1.5">
                {['Transportation & Escort', 'Combating Loneliness', 'Food Preparation & Delivery', 'Learning & Skills Workshops', 'Community Events', 'Other'].map(cause => (
                  <span key={cause} className="text-xs px-2.5 py-1 rounded-full cursor-pointer transition-colors" style={{ background: '#f0e8d0', color: '#6b5c3e', border: '1px solid #C9A84C' }}>
                    {cause}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Feed */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1" style={{ color: '#1A2744' }}>Community Feed</h1>
            <p className="text-sm" style={{ color: '#6b5c3e' }}>Stories, updates, and inspiration from fellow volunteers</p>
          </div>

          {user && <CreatePost currentUser={user} onCreated={loadPosts} />}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-muted rounded w-1/3" />
                      <div className="h-2 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A2744' }}>Be the first to share!</h3>
              <p className="text-sm" style={{ color: '#6b5c3e' }}>Your volunteer story could inspire someone to take action today.</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                onUpdate={loadPosts}
                isMod={isMod}
              />
            ))
          )}
        </div>

        {/* Right sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <div className="rounded-2xl p-5" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
              <h3 className="font-semibold text-sm mb-4" style={{ color: '#1A2744' }}>Quick Links</h3>
              <div className="space-y-2 text-sm">
                <a href="/opportunities" className="flex items-center gap-2 py-1 transition-colors" style={{ color: '#6b5c3e' }}>
                  📋 Browse Opportunities
                </a>
                <a href="/events" className="flex items-center gap-2 py-1 transition-colors" style={{ color: '#6b5c3e' }}>
                  📅 Upcoming Events
                </a>
                <a href="/profile" className="flex items-center gap-2 py-1 transition-colors" style={{ color: '#6b5c3e' }}>
                  👤 My Profile & Impact
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}