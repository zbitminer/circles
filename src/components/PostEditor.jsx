import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function PostEditor({ post, onSaved, onCancel }) {
  const [content, setContent] = useState(post.content || '');
  const [title, setTitle] = useState(post.title || '');
  const [location, setLocation] = useState(post.location || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const save = async event => {
    event.preventDefault(); if (!content.trim() || busy) return;
    setBusy(true); setError('');
    try { await base44.entities.Post.update(post.id, { content: content.trim(), title: title.trim(), location: location.trim() }); onSaved(); }
    catch (err) { setError(err?.message || 'Unable to save your changes.'); }
    finally { setBusy(false); }
  };
  return <form onSubmit={save} className="space-y-3 px-5 pb-4">
    <label className="block text-sm">Title<Input value={title} onChange={e => setTitle(e.target.value)} /></label>
    <label className="block text-sm">{post.post_type === 'request' ? 'Request details' : 'Your story'}<Textarea required rows={6} value={content} onChange={e => setContent(e.target.value)} /></label>
    {post.post_type === 'request' && <label className="block text-sm">Location<Input value={location} onChange={e => setLocation(e.target.value)} /></label>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="flex flex-wrap gap-2"><Button disabled={busy || !content.trim()}>{busy ? 'Saving…' : 'Save changes'}</Button><Button type="button" variant="outline" disabled={busy} onClick={onCancel}>Cancel</Button></div>
  </form>;
}