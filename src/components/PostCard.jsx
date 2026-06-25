import { useState } from 'react';
import { Heart, MessageCircle, Flag, MoreHorizontal, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { formatDistanceToNow } from 'date-fns';

const CAUSE_BANNERS = {
  'Companionship': 'bg-orange-100',
  'Food': 'bg-yellow-100',
  'Home': 'bg-gray-100',
  'Skills Sharing': 'bg-pink-100',
  'Technology': 'bg-indigo-100',
  'Transportation': 'bg-blue-100',
  'Other': 'bg-muted',
};

const CAUSE_EMOJIS = {
  'Companionship': '🤝',
  'Food': '🍲',
  'Home': '🔧',
  'Skills Sharing': '🌟',
  'Technology': '💻',
  'Transportation': '🚗',
  'Other': '💡',
};

const CAUSE_COLORS = {
  'Companionship': 'bg-orange-100 text-orange-800',
  'Food': 'bg-yellow-100 text-yellow-800',
  'Home': 'bg-gray-100 text-gray-800',
  'Skills Sharing': 'bg-pink-100 text-pink-800',
  'Technology': 'bg-indigo-100 text-indigo-800',
  'Transportation': 'bg-blue-100 text-blue-800',
  'Other': 'bg-muted text-muted-foreground',
};

const CAUSE_FALLBACK_IMAGES = {
  'Companionship': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/c79fb37f1_generated_image.png',
  'Food': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/82f0b4303_generated_image.png',
  'Home': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/f964c61dc_generated_image.png',
  'Skills Sharing': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/440c340f7_generated_image.png',
  'Technology': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/ff0585af8_generated_image.png',
  'Transportation': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/0e74a935e_generated_image.png',
};

const DEFAULT_FALLBACK_IMAGES = [
  'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/c79fb37f1_generated_image.png',
  'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/82f0b4303_generated_image.png',
  'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/f964c61dc_generated_image.png',
  'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/440c340f7_generated_image.png',
  'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/ff0585af8_generated_image.png',
  'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/0e74a935e_generated_image.png',
];

export default function PostCard({ post, currentUser, onUpdate, onDelete, isMod }) {
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(post.likes?.includes(currentUser?.id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  const handleLike = async () => {
    if (!currentUser) return;
    const newLikes = liked
      ? (post.likes || []).filter(id => id !== currentUser.id)
      : [...(post.likes || []), currentUser.id];
    setLiked(!liked);
    setLikeCount(newLikes.length);
    await base44.entities.Post.update(post.id, { likes: newLikes });
    onUpdate?.();
  };

  const handleReport = async () => {
    if (!currentUser) return;
    const reported = [...(post.reported_by || []), currentUser.id];
    await base44.entities.Post.update(post.id, { reported_by: reported, status: 'flagged' });
    onUpdate?.();
    setShowMenu(false);
  };

  const handleRemove = async () => {
    await base44.entities.Post.update(post.id, { status: 'removed' });
    onUpdate?.();
    setShowMenu(false);
  };

  const loadComments = async () => {
    setLoadingComments(true);
    const data = await base44.entities.Comment.filter({ post_id: post.id });
    setComments(data.filter(c => c.status !== 'removed'));
    setLoadingComments(false);
  };

  const toggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(!showComments);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser || submittingComment) return;
    setCommentError('');
    setSubmittingComment(true);
    try {
      await base44.entities.Comment.create({
        post_id: post.id,
        author_id: currentUser.id,
        author_name: currentUser.full_name,
        content: commentText,
      });
      setCommentText('');
      loadComments();
      onUpdate?.();
      // Update comment count in background — may fail for non-authors due to Post RLS
      base44.entities.Post.update(post.id, { comment_count: (post.comment_count || 0) + 1 }).catch(() => {});
    } catch (err) {
      setCommentError(err?.response?.data?.error || err?.message || 'Could not post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const initials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="p-5 pb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex-shrink-0 overflow-hidden shadow-sm border border-border">
            {post.author_avatar
              ? <img src={post.author_avatar} alt={post.author_name} className="w-full h-full object-cover" />
              : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                  {initials(post.author_name)}
                </div>
              )}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{post.author_name || 'Anonymous'}</p>
            <p className="text-xs text-muted-foreground">
              {post.created_date ? formatDistanceToNow(new Date(post.created_date), { addSuffix: true }) : ''}
            </p>
          </div>
        </div>

        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-card border border-border rounded-xl shadow-lg z-10 min-w-[160px] overflow-hidden">
              {currentUser && post.author_id !== currentUser.id && (
                <button onClick={handleReport} className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted text-left">
                  <Flag className="w-4 h-4 text-orange-500" /> Report post
                </button>
              )}
              {(isMod || currentUser?.id === post.author_id) && (
                <button onClick={handleRemove} className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted text-left text-destructive">
                  <Trash2 className="w-4 h-4" /> Remove post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cause Tags */}
      {post.cause_tags?.length > 0 && (
        <div className="px-5 pb-2 flex flex-wrap gap-1">
          {post.cause_tags.map(tag => (
            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAUSE_COLORS[tag] || 'bg-muted text-muted-foreground'}`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="px-5 pb-3">
        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Image */}
      {(() => {
        const imgSrc = post.image_url
          || CAUSE_FALLBACK_IMAGES[post.cause_tags?.[0]]
          || DEFAULT_FALLBACK_IMAGES[post.id ? post.id.charCodeAt(0) % DEFAULT_FALLBACK_IMAGES.length : 0];
        return (
          <div className="px-5 pb-3">
            <img src={imgSrc} alt="Post" className="w-full rounded-xl object-cover max-h-80" />
          </div>
        );
      })()}

      {/* Actions */}
      <div className="px-5 py-3 border-t border-border flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-accent' : 'text-muted-foreground hover:text-accent'}`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          <span>{likeCount}</span>
        </button>
        <button
          onClick={toggleComments}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.comment_count || 0}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-5 pb-4 border-t border-border pt-3 space-y-3">
          {loadingComments ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
          ) : (
            comments.map(c => (
              <div key={c.id} className="flex gap-2">
                <div className="w-7 h-7 rounded-xl flex-shrink-0 overflow-hidden border border-border">
                  {c.author_avatar
                    ? <img src={c.author_avatar} alt={c.author_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">{initials(c.author_name)}</div>
                  }
                </div>
                <div className="bg-muted rounded-xl px-3 py-2 flex-1">
                  <p className="text-xs font-semibold mb-0.5">{c.author_name}</p>
                  <p className="text-xs text-foreground">{c.content}</p>
                </div>
              </div>
            ))
          )}
          {currentUser && (
            <form onSubmit={submitComment} className="mt-2 space-y-1">
              <div className="flex gap-2">
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  disabled={submittingComment}
                  className="flex-1 text-sm bg-muted rounded-xl px-3 py-2 outline-none border border-transparent focus:border-primary/30 disabled:opacity-50"
                />
                <button type="submit" disabled={submittingComment || !commentText.trim()} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                  {submittingComment ? 'Posting...' : 'Post'}
                </button>
              </div>
              {commentError && <p className="text-xs text-destructive px-1">{commentError}</p>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}