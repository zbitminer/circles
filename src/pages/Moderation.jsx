import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, Flag, CheckCircle, Trash2, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useLanguage } from '@/lib/i18n';

export default function Moderation() {
  const { t, localize, dateLocale } = useLanguage();
  const [user, setUser] = useState(null);
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(null);
  const [total, setTotal] = useState(0);
  const [needsReview, setNeedsReview] = useState(0);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u?.role === 'moderator' || u?.role === 'admin') loadData();
    }).catch(() => {});
  }, []);

  const loadData = async (cursor) => {
    setLoading(true);
    setError('');
    const query = { status: { $ne: 'removed' }, $or: [{ status: 'flagged' }, { 'reported_by.0': { $exists: true } }] };
    try {
      const [result, count, pending] = await Promise.all([
        base44.entities.Post.filter(query, { sort: '-created_date', limit: 50, ...(cursor ? { cursor } : {}) }),
        base44.entities.Post.count(query),
        base44.entities.Post.count({ status: 'flagged' })
      ]);
      setFlaggedPosts(prev => cursor ? [...prev, ...result.items] : result.items);
      setPage(result);
      setTotal(count);
      setNeedsReview(pending);
    } catch (err) {
      setError(err?.message || 'Could not load reported posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const review = async (post, status) => {
    if (busyId) return;
    setBusyId(post.id);
    setError('');
    try {
      await base44.entities.Post.update(post.id, { status, reported_by: [] });
      await loadData();
    } catch (err) {
      setError(err?.message || 'Could not review this post. Please try again.');
    } finally {
      setBusyId(null);
    }
  };

  const isMod = user?.role === 'moderator' || user?.role === 'admin';

  if (!isMod) {
    return localize(
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: '#bd4c0f' }} />
        <h1 className="font-display text-2xl font-bold mb-2" style={{ color: '#141414' }}>Access Restricted</h1>
        <p style={{ color: '#6b7280' }}>You need moderator or admin access to view this page.</p>
      </div>
    );
  }

  return localize(
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#141414', border: '1px solid #bd4c0f' }}>
          <Shield className="w-5 h-5" style={{ color: '#fbe8d4' }} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: '#141414' }}>Content Moderation</h1>
          <p className="text-sm" style={{ color: '#6b7280' }}>Review reported and flagged content</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl p-5" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
          <div className="flex items-center gap-3">
            <Flag className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-display text-2xl font-bold" style={{ color: '#141414' }}>{total}</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>Flagged Posts</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-5" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5" style={{ color: '#141414' }} />
            <div>
              <p className="font-display text-2xl font-bold" style={{ color: '#141414' }}>{needsReview}</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>Needs Review</p>
            </div>
          </div>
        </div>
      </div>

      {error && <div role="alert" className="mb-4 text-sm text-destructive">{error} <button onClick={() => loadData()} className="underline">Retry</button></div>}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="rounded-2xl p-5 animate-pulse h-32" style={{ background: '#fcfaf8', border: '1px solid #bd4c0f' }} />)}
        </div>
      ) : error ? null : flaggedPosts.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#141414' }}>All clear!</h3>
          <p className="text-sm" style={{ color: '#6b7280' }}>No flagged or reported content to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flaggedPosts.map(post => (
            <div key={post.id} className="rounded-2xl p-5" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Flag className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-semibold uppercase text-orange-600">
                       {post.status === 'flagged' ? t('Flagged') : t('Reported')}
                     </span>
                     {post.reported_by?.length > 0 && (
                       <span className="text-xs" style={{ color: '#888' }}>· {post.reported_by.length} {t('report(s)')}</span>
                     )}
                    </div>
                    <p className="text-xs" style={{ color: '#888' }}>
                     {t('By')} {post.author_name} · {post.created_date ? formatDistanceToNow(new Date(post.created_date), { addSuffix: true, locale: dateLocale }) : ''}
                    </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-4 border-l-4 border-orange-300 pl-3" style={{ color: '#141414' }}>
                {post.content}
              </p>

              {post.image_url && (
                <img src={post.image_url} alt="" className="w-32 h-24 rounded-xl object-cover mb-4" />
              )}

              <div className="flex gap-3">
                <button disabled={!!busyId} onClick={() => review(post, 'active')} className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-xl hover:bg-green-200 transition-colors">
                  <CheckCircle className="w-4 h-4" /> {t('Approve & Keep')}
                 </button>
                 <button disabled={!!busyId} onClick={() => review(post, 'removed')} className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive text-sm font-semibold rounded-xl hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-4 h-4" /> {t('Remove Post')}
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {page?.has_more && !loading && <button onClick={() => loadData(page.next_cursor)} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground">Load more reports</button>}
    </div>
  );
}