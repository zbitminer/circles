import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, X } from 'lucide-react';

export default function Messages({ currentUser, initialConversation }) {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    loadConversations();
  }, [currentUser]);

  useEffect(() => {
    if (initialConversation && !selected) {
      setSelected(initialConversation);
    }
  }, [initialConversation]);

  useEffect(() => {
    if (selected?.conversation_id) {
      loadMessages(selected.conversation_id);
      const unsubscribe = base44.entities.Message.subscribe((event) => {
        if (event.data.conversation_id === selected.conversation_id) {
          loadMessages(selected.conversation_id);
        }
      });
      return unsubscribe;
    } else {
      setMessages([]);
    }
  }, [selected]);

  const loadConversations = async () => {
    setLoading(true);
    const allMessages = await base44.entities.Message.list('-created_date', 100);
    const convs = {};
    allMessages.forEach(msg => {
      const otherId = msg.from_user_id === currentUser.id ? msg.to_user_id : msg.from_user_id;
      const otherName = msg.from_user_id === currentUser.id ? msg.to_user_name : msg.from_user_name;
      if (!convs[otherId]) {
        convs[otherId] = { user_id: otherId, user_name: otherName, last_message: msg.content, conversation_id: msg.conversation_id };
      }
    });
    setConversations(Object.values(convs));
    setLoading(false);
  };

  const loadMessages = async (convId) => {
    const msgs = await base44.entities.Message.filter({ conversation_id: convId }, '-created_date', 50);
    setMessages(msgs.reverse());
    await base44.entities.Message.bulkCreate(
      msgs.filter(m => m.to_user_id === currentUser.id && !m.is_read).map(m => ({ ...m, is_read: true }))
    );
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selected) return;
    const convId = selected.conversation_id || `${currentUser.id}-${selected.user_id}`;
    await base44.entities.Message.create({
      from_user_id: currentUser.id,
      from_user_name: currentUser.full_name,
      to_user_id: selected.user_id,
      to_user_name: selected.user_name,
      content: newMessage,
      conversation_id: convId
    });
    await base44.entities.Notification.create({
      user_id: selected.user_id,
      type: 'new_message',
      title: `New message from ${currentUser.full_name}`,
      message: newMessage.slice(0, 80),
      related_id: convId,
      related_user_name: currentUser.full_name
    }).catch(() => {});
    setNewMessage('');
    loadMessages(convId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      {/* Conversation List */}
      <div className="border rounded-2xl overflow-hidden flex flex-col" style={{ borderColor: '#C9A84C', background: '#FAF7EE' }}>
        <div className="p-4 border-b font-semibold" style={{ borderColor: '#C9A84C', color: '#1A2744' }}>Messages</div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm" style={{ color: '#6b5c3e' }}>Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-sm" style={{ color: '#6b5c3e' }}>No conversations yet</div>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.user_id}
                onClick={() => setSelected(conv)}
                className="w-full p-4 border-b text-left transition-all hover:opacity-80"
                style={{
                  borderColor: '#C9A84C',
                  background: selected?.user_id === conv.user_id ? '#f0e8d0' : 'transparent',
                  color: '#1A2744'
                }}
              >
                <p className="font-semibold text-sm">{conv.user_name}</p>
                <p className="text-xs line-clamp-1 mt-1" style={{ color: '#6b5c3e' }}>{conv.last_message}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat View */}
      {selected ? (
        <div className="md:col-span-2 border rounded-2xl overflow-hidden flex flex-col" style={{ borderColor: '#C9A84C', background: '#FAF7EE' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#C9A84C' }}>
            <div className="font-semibold" style={{ color: '#1A2744' }}>{selected.user_name}</div>
            <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-gray-200"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from_user_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="px-4 py-2 rounded-xl max-w-xs text-sm"
                  style={{
                    background: msg.from_user_id === currentUser.id ? '#1A2744' : '#e0d5be',
                    color: msg.from_user_id === currentUser.id ? '#F5E6C0' : '#1A2744'
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex gap-2" style={{ borderColor: '#C9A84C' }}>
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-xl bg-white border outline-none"
              style={{ borderColor: '#C9A84C' }}
            />
            <button onClick={handleSend} className="p-2 rounded-xl transition-opacity hover:opacity-80" style={{ background: '#1A2744', color: '#F5E6C0' }}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="md:col-span-2 border rounded-2xl flex items-center justify-center" style={{ borderColor: '#C9A84C', background: '#FAF7EE' }}>
          <div className="text-center" style={{ color: '#6b5c3e' }}>
            <p className="text-lg">💬</p>
            <p>Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}