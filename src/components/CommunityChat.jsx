import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, Users } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

const COMMUNITY_CONV_ID = 'community_chat';

const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

export default function CommunityChat({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const unsubscribe = base44.entities.Message.subscribe((event) => {
      if (event.data.conversation_id === COMMUNITY_CONV_ID) {
        loadMessages();
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      const msgs = await base44.entities.Message.filter({ conversation_id: COMMUNITY_CONV_ID }, 'created_date', 100);
      setMessages(msgs);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await base44.entities.Message.create({
        from_user_id: currentUser.id,
        from_user_name: currentUser.full_name,
        to_user_id: 'community',
        to_user_name: 'Community Chat',
        content: newMessage,
        conversation_id: COMMUNITY_CONV_ID
      });
      setNewMessage('');
      loadMessages();
    } catch {
      // ignore
    }
    setSending(false);
  };

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col h-[600px]" style={{ borderColor: '#C9A84C', background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: '#C9A84C', background: '#1A2744' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#C9A84C' }}>
          <Users className="w-5 h-5" style={{ color: '#1A2744' }} />
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: '#F5E6C0' }}>Community Chat Room</p>
          <p className="text-xs" style={{ color: 'rgba(245,230,192,0.6)' }}>Everyone in the community · Be kind & respectful</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center text-sm py-8" style={{ color: '#6b5c3e' }}>Loading messages…</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💬</div>
            <p className="font-semibold text-sm" style={{ color: '#1A2744' }}>No messages yet</p>
            <p className="text-xs mt-1" style={{ color: '#6b5c3e' }}>Be the first to say hello!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.from_user_id === currentUser.id;
            return (
              <div key={msg.id} className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: '#C9A84C', color: '#1A2744' }}>
                    {initials(msg.from_user_name)}
                  </div>
                )}
                <div className="max-w-[70%]">
                  {!isMe && <p className="text-xs font-semibold mb-0.5" style={{ color: '#1A2744' }}>{msg.from_user_name}</p>}
                  <div
                    className="px-4 py-2 rounded-2xl text-sm"
                    style={{
                      background: isMe ? '#1A2744' : '#fff',
                      color: isMe ? '#F5E6C0' : '#1A2744',
                      border: isMe ? 'none' : '1px solid #e0d5b0'
                    }}
                  >
                    {msg.content}
                  </div>
                  {msg.created_date && (
                    <p className="text-[10px] mt-0.5" style={{ color: '#aaa' }}>
                      {formatDistanceToNow(parseISO(msg.created_date), { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2" style={{ borderColor: '#C9A84C' }}>
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !sending && handleSend()}
          placeholder="Share something with the community…"
          className="flex-1 px-4 py-2.5 rounded-xl bg-white border outline-none text-sm"
          style={{ borderColor: '#C9A84C' }}
        />
        <button
          onClick={handleSend}
          disabled={sending || !newMessage.trim()}
          className="px-4 rounded-xl transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: '#1A2744', color: '#F5E6C0' }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}