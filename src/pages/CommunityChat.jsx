import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import CommunityChat from '@/components/CommunityChat';

export default function CommunityChatPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8 text-center">
        <div className="rounded-2xl p-10" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: '#1A2744' }}>Sign in to join the chat</h2>
          <p className="text-sm mb-4" style={{ color: '#6b5c3e' }}>You need an account to participate in the community chat room.</p>
          <Link to="/register" className="inline-block px-6 py-3 rounded-full font-bold text-sm hover:opacity-90" style={{ background: '#1A2744', color: '#F5E6C0' }}>
            Register Free →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold" style={{ color: '#1A2744' }}>💬 Community Chat</h1>
        <p className="text-sm mt-2" style={{ color: '#6b5c3e' }}>A shared space for all members to connect, share, and collaborate</p>
      </div>
      <CommunityChat currentUser={user} />
    </div>
  );
}