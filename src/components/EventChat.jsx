import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function EventChat({ eventId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const [notice, setNotice] = useState('');

  // Messages are only readable by participants, so we go through the eventChat function
  // and poll instead of subscribing to the entity directly.
  useEffect(() => {
    let active = true;
    const load = async (initial) => {
      if (initial) setLoading(true);
      try {
        const res = await base44.functions.invoke('eventChat', { action: 'list', event_id: eventId });
        if (active) { setMessages(res.data?.messages || []); setNotice(''); }
      } catch (err) {
        if (active) setNotice(err?.response?.data?.error || 'Chat is unavailable right now.');
      } finally {
        if (active && initial) setLoading(false);
      }
    };
    load(true);
    const timer = setInterval(() => load(false), 10000);
    return () => { active = false; clearInterval(timer); };
  }, [eventId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentUser) return;
    setSending(true);
    try {
      const res = await base44.functions.invoke('eventChat', { action: 'send', event_id: eventId, content: text.trim() });
      if (res.data?.message) setMessages(prev => [...prev, res.data.message]);
      setText('');
    } catch (err) {
      setNotice(err?.response?.data?.error || 'Could not send message.');
    } finally {
      setSending(false);
    }
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="border-t border-border mt-4 pt-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-4 h-4 text-accent" />
        <h3 className="font-semibold text-sm">Event Chat</h3>
        <span className="text-xs text-muted-foreground">({messages.length})</span>
      </div>

      {/* Messages */}
      <div className="max-h-52 overflow-y-auto space-y-3 mb-3 pr-1">
        {notice && <p className="text-xs text-muted-foreground mb-2">{notice}</p>}
        {loading ? (
          <p className="text-xs text-muted-foreground text-center py-4">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No messages yet. Be the first to say something!</p>
        ) : (
          messages.map(msg => {
            const isMe = currentUser && msg.author_id === currentUser.id;
            return (
              <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold flex-shrink-0">
                  {initials(msg.author_name)}
                </div>
                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-3 py-2 rounded-2xl text-sm ${isMe ? 'bg-accent text-white rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                  <span className="text-xs text-muted-foreground mt-0.5 px-1">
                    {!isMe && <span className="font-medium">{msg.author_name} · </span>}
                    {msg.created_date ? formatDistanceToNow(new Date(msg.created_date), { addSuffix: true }) : ''}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {currentUser ? (
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Send a message to participants..."
            className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm outline-none border border-transparent focus:border-primary/30"
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="p-2 bg-accent text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <p className="text-xs text-muted-foreground text-center">Sign in to participate in the chat</p>
      )}
    </div>
  );
}