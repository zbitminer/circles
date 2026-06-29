import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import MessageComponent from '@/components/Messages';

export default function MessagesPage() {
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const toUser = searchParams.get('to');
  const toName = searchParams.get('name');
  const initialConversation = toUser ? { user_id: toUser, user_name: toName || 'New conversation', conversation_id: null } : null;

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8 text-center">
        <p style={{ color: '#6b5c3e' }}>Please sign in to view messages</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold" style={{ color: '#1A2744' }}>💬 Messages</h1>
        <p className="text-sm mt-2" style={{ color: '#6b5c3e' }}>Connect directly with fellow volunteers</p>
      </div>

      {/* How it Works - 3 Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { step: '1', emoji: '👥', title: 'Find Volunteers', desc: 'Browse the Directory and find people who share your interests.' },
          { step: '2', emoji: '💌', title: 'Send Message', desc: 'Start a conversation and get to know each other better.' },
          { step: '3', emoji: '🤝', title: 'Collaborate', desc: 'Coordinate volunteer activities and build meaningful connections.' },
        ].map(({ step, emoji, title, desc }) => (
          <div key={step} className="flex flex-col items-center gap-2 p-4 rounded-xl text-center" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: '#1A2744', color: '#F5E6C0' }}>{step}</div>
            <div className="text-xl">{emoji}</div>
            <h3 className="font-semibold text-xs" style={{ color: '#1A2744' }}>{title}</h3>
            <p className="text-xs" style={{ color: '#6b5c3e' }}>{desc}</p>
          </div>
        ))}
      </div>

      <MessageComponent currentUser={user} initialConversation={initialConversation} />
    </div>
  );
}