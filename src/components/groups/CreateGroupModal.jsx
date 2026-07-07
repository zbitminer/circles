import { useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORIES = ['Companionship', 'Food', 'Home', 'Skill Sharing', 'Technology', 'Transportation', 'Wellness', 'Other'];

export default function CreateGroupModal({ user, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', description: '', cover_image: '', category: 'Companionship', privacy: 'public' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const group = await base44.entities.Group.create({
        ...form,
        owner_id: user.id,
        owner_name: user.full_name,
        member_count: 1,
      });
      await base44.entities.GroupMembership.create({
        group_id: group.id,
        user_id: user.id,
        user_name: user.full_name,
        role: 'owner',
        status: 'active',
      });
      onCreated?.();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto rounded-xl" style={{ background: '#fff', border: '1.5px solid #C99738' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold" style={{ color: '#1A1A1A' }}>Create a Group</h2>
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-lg"><X className="w-4 h-4" style={{ color: '#555' }} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>Group Name *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="e.g. Tsfat Home Helpers" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" placeholder="What is this group about?" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>Cover Image URL</label>
            <input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="https://… (optional)" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#555' }}>Privacy</label>
              <select value={form.privacy} onChange={(e) => setForm({ ...form, privacy: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm" style={{ color: '#555' }}>Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2.5 text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" style={{ background: '#1A1A1A', color: '#fff', border: '1px solid #C99738' }}>
              {submitting ? 'Creating…' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}