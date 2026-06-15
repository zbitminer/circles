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

  useEffect(() => {
    loadMessages();
    const unsubscribe = base44.entities.EventMessage.subscribe((event) => {
      if (event.data?.event_id === eventId) {
        setMessages(prev => {
          if (event.type === 'create') return [...prev, event.data];
          if (event.type === 'delete') return prev.filter(m => m.id !== event.id);
          return prev;
        });
      }
    });
    return unsubscribe;
  }, [eventId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    const data = await base44.entities.EventMessage.filter({ event_id: eventId }, 'created_date', 100);
    setMessages(data);
    setLoading(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentUser) return;
    setSending(true);
    await base44.entities.EventMessage.create({
      event_id: eventId,
      author_id: currentUser.id,
      author_name: currentUser.full_name || 'Anonymous',
      content: text.trim(),
    });
    setText('');
    setSending(false);
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