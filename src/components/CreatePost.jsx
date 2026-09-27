import { useState, useRef, useEffect } from 'react';
import { Image, X, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CAUSES = ['Companionship', 'Food', 'Home', 'Skills Sharing', 'Technology', 'Transportation', 'Other'];

export default function CreatePost({ currentUser, onCreated, mode = 'story', topics = [], autoFocus = false }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState(() => topics.length ? `Help with ${topics.join(', ')}` : '');
  const [location, setLocation] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { if (autoFocus) inputRef.current?.focus(); }, [autoFocus]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCauses, setSelectedCauses] = useState(topics);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(autoFocus);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const toggleCause = (cause) => {
    setSelectedCauses(prev =>
      prev.includes(cause) ? prev.filter(c => c !== cause) : [...prev, cause]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!content.trim() && !imageFile) || !currentUser || loading) return;
    setError('');
    if (mode === 'request' && (!title.trim() || !content.trim())) { setError('Please add a request title and explain what help you need.'); return; }
    setLoading(true);
    try {
      let image_url = null;
      if (imageFile) {
        const { file_url } = await base44.integrations.Core.UploadPublicFile({ file: imageFile });
        image_url = file_url;
      }
      await base44.entities.Post.create({
        author_id: currentUser.id,
        author_name: currentUser.full_name,
        content: content.trim() || 'Shared a community photo.',
        title: title.trim(), location: location.trim(), post_type: mode,
        status: 'active',
        image_url,
        cause_tags: selectedCauses,
        likes: [],
        comment_count: 0,
      });
      setContent('');
      setTitle(''); setLocation('');
      setImageFile(null);
      setImagePreview(null);
      setSelectedCauses([]);
      setExpanded(false);
      onCreated?.();
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Could not share your post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initials = currentUser?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div id="community-post-composer" className="bg-card rounded-2xl shadow-sm border border-border p-5 scroll-mt-28">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl">{mode === 'request' ? 'Post a Request' : 'Share your story'}</h2>
        <button type="button" onClick={handleSubmit} disabled={(!content.trim() && !imageFile) || loading} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">{loading ? 'Posting…' : mode === 'request' ? 'Post Request' : 'Post'}</button>
      </div>
      {mode === 'request' && <div className="mb-4 space-y-3">
        <label className="block text-sm">What do you need? *<input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-3" /></label>
        <label className="block text-sm">Location<input value={location} onChange={e => setLocation(e.target.value)} placeholder="City / area" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-3" /></label>
        {topics.length > 0 && <p className="text-xs text-muted-foreground">Selected topics: {topics.join(', ')}</p>}
      </div>}
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <textarea
            ref={inputRef}
            aria-label={mode === 'request' ? 'Request details' : 'Your story'}
            value={content}
            onChange={e => { setContent(e.target.value); if (!expanded) setExpanded(true); }}
            onFocus={() => setExpanded(true)}
            placeholder={mode === 'request' ? 'Describe the help you need and when you need it…' : 'Share your volunteer story, experience, or inspiration...'}
            rows={expanded ? 4 : 2}
            className="w-full text-sm bg-muted rounded-xl px-4 py-3 outline-none resize-none border border-transparent focus:border-primary/30 transition-all placeholder:text-muted-foreground"
          />

            <div className="mt-3 space-y-3">
              {/* Cause tags */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Tag a cause (optional):</p>
                <div className="flex flex-wrap gap-1.5">
                  {CAUSES.map(cause => (
                    <button
                      key={cause}
                      type="button"
                      onClick={() => toggleCause(cause)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        selectedCauses.includes(cause)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {cause}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image preview */}
              {imagePreview && (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="max-h-40 rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                  <Image className="w-4 h-4" />
                  <span>Add photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </label>
                <div className="flex gap-2">
                  {expanded && (
                    <button
                      type="button"
                      onClick={() => { setExpanded(false); setContent(''); setImageFile(null); setImagePreview(null); setSelectedCauses([]); }}
                      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  )}

                </div>
              </div>
              {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
            </div>
        </div>
      </div>
    </div>
  );
}