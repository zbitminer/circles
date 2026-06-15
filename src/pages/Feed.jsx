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
        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <div className="bg-primary text-primary-foreground rounded-2xl p-6">
              <h2 className="font-display text-2xl font-bold mb-2">I Give.<br />I Receive.<br />I Belong.</h2>
              <p className="text-primary-foreground/70 text-sm mb-4">I contribute what I have. I receive what I need. Together, we build circles of belonging.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <Users className="w-4 h-4 text-accent" />
                  <span>Vibrant community</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <Flame className="w-4 h-4 text-accent" />
                  <span>Real social impact</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span>Grow together</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-sm mb-3">Explore Causes</h3>
              <div className="flex flex-wrap gap-1.5">
                {['Environment', 'Education', 'Health', 'Animals', 'Community', 'Youth'].map(cause => (
                  <span key={cause} className="text-xs px-2.5 py-1 bg-muted rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors">
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
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">Community Feed</h1>
            <p className="text-muted-foreground text-sm">Stories, updates, and inspiration from fellow volunteers</p>
          </div>

          {user && <CreatePost currentUser={user} onCreated={loadPosts} />}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card rounded-2xl border border-border p-5 animate-pulse">
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
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="font-display text-xl font-bold mb-2">Be the first to share!</h3>
              <p className="text-muted-foreground text-sm">Your volunteer story could inspire someone to take action today.</p>
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
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-sm mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm">
                <a href="/opportunities" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-1">
                  📋 Browse Opportunities
                </a>
                <a href="/events" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-1">
                  📅 Upcoming Events
                </a>
                <a href="/profile" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-1">
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