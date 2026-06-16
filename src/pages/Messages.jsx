import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import MessageComponent from '@/components/Messages';

export default function MessagesPage() {
  const [user, setUser] = useState(null);

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
      <MessageComponent currentUser={user} />
    </div>
  );
}