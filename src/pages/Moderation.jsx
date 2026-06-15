import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, Flag, CheckCircle, Trash2, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Moderation() {
  const [user, setUser] = useState(null);
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('flagged');

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u?.role === 'moderator' || u?.role === 'admin') loadData();
    }).catch(() => {});
  }, []);

  const loadData = async () => {
    setLoading(true);
    const posts = await base44.entities.Post.list('-created_date', 100);
    setFlaggedPosts(posts.filter(p => p.status === 'flagged' || p.reported_by?.length > 0));
    setLoading(false);
  };

  const approve = async (post) => {
    await base44.entities.Post.update(post.id, { status: 'active', reported_by: [] });
    loadData();
  };

  const remove = async (post) => {
    await base44.entities.Post.update(post.id, { status: 'removed' });
    loadData();
  };

  const isMod = user?.role === 'moderator' || user?.role === 'admin';

  if (!isMod) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Access Restricted</h1>
        <p className="text-muted-foreground">You need moderator or admin access to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Content Moderation</h1>
          <p className="text-muted-foreground text-sm">Review reported and flagged content</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3">
            <Flag className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-display text-2xl font-bold">{flaggedPosts.length}</p>
              <p className="text-xs text-muted-foreground">Flagged Posts</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-primary" />
            <div>
              <p className="font-display text-2xl font-bold">{flaggedPosts.filter(p => p.status === 'flagged').length}</p>
              <p className="text-xs text-muted-foreground">Needs Review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="bg-card rounded-2xl border border-border p-5 animate-pulse h-32" />)}
        </div>
      ) : flaggedPosts.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold mb-2">All clear!</h3>
          <p className="text-muted-foreground text-sm">No flagged or reported content to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flaggedPosts.map(post => (
            <div key={post.id} className="bg-card rounded-2xl border border-orange-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Flag className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-semibold text-orange-600 uppercase">
                      {post.status === 'flagged' ? 'Flagged' : 'Reported'}
                    </span>
                    {post.reported_by?.length > 0 && (
                      <span className="text-xs text-muted-foreground">· {post.reported_by.length} report(s)</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By {post.author_name} · {post.created_date ? formatDistanceToNow(new Date(post.created_date), { addSuffix: true }) : ''}
                  </p>
                </div>
              </div>

              <p className="text-sm text-foreground mb-4 leading-relaxed border-l-4 border-orange-200 pl-3">
                {post.content}
              </p>

              {post.image_url && (
                <img src={post.image_url} alt="" className="w-32 h-24 rounded-xl object-cover mb-4" />
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => approve(post)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-xl hover:bg-green-200 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Approve & Keep
                </button>
                <button
                  onClick={() => remove(post)}
                  className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive text-sm font-semibold rounded-xl hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Remove Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}