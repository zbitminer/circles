import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/lib/i18n';
import { Send, X } from 'lucide-react';

export default function Messages({ currentUser, initialContact }) {
  const { localize } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    loadConversations();
    if (initialContact) {
      setSelected({
        user_id: initialContact.user_id,
        user_name: initialContact.user_name,
        conversation_id: `${currentUser.id}-${initialContact.user_id}`
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (selected) {
      loadMessages(selected.conversation_id);
      const unsubscribe = base44.entities.Message.subscribe((event) => {
        if (event.data?.conversation_id === selected.conversation_id) {
          loadMessages(selected.conversation_id);
        }
      });
      return unsubscribe;
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
    const unreadUpdates = msgs.filter(m => m.to_user_id === currentUser.id && !m.is_read).map(m => ({ id: m.id, is_read: true }));
    if (unreadUpdates.length > 0) {
      await base44.entities.Message.bulkUpdate(unreadUpdates);
    }
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
    setNewMessage('');
    loadMessages(convId);
  };

  return localize(
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      {/* Conversation List */}
      <div className="border rounded-2xl overflow-hidden flex flex-col" style={{ borderColor: '#bd4c0f', background: '#fcfaf8' }}>
        <div className="p-4 border-b font-semibold" style={{ borderColor: '#bd4c0f', color: '#141414' }}>Messages</div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm" style={{ color: '#6b7280' }}>Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-sm" style={{ color: '#6b7280' }}>No conversations yet</div>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.user_id}
                onClick={() => setSelected(conv)}
                className="w-full p-4 border-b text-left transition-all hover:opacity-80"
                style={{
                  borderColor: '#bd4c0f',
                  background: selected?.user_id === conv.user_id ? '#fbe8d4' : 'transparent',
                  color: '#141414'
                }}
              >
                <p className="font-semibold text-sm">{conv.user_name}</p>
                <p className="text-xs line-clamp-1 mt-1" style={{ color: '#6b7280' }}>{conv.last_message}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat View */}
      {selected ? (
        <div className="md:col-span-2 border rounded-2xl overflow-hidden flex flex-col" style={{ borderColor: '#bd4c0f', background: '#fcfaf8' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#bd4c0f' }}>
            <div className="font-semibold" style={{ color: '#141414' }}>{selected.user_name}</div>
            <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-gray-200"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from_user_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="px-4 py-2 rounded-xl max-w-xs text-sm"
                  style={{
                    background: msg.from_user_id === currentUser.id ? '#141414' : '#dcd5cc',
                    color: msg.from_user_id === currentUser.id ? '#fbe8d4' : '#141414'
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex gap-2" style={{ borderColor: '#bd4c0f' }}>
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-xl bg-white border outline-none"
              style={{ borderColor: '#bd4c0f' }}
            />
            <button onClick={handleSend} className="p-2 rounded-xl transition-opacity hover:opacity-80" style={{ background: '#141414', color: '#fbe8d4' }}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="md:col-span-2 border rounded-2xl flex items-center justify-center" style={{ borderColor: '#bd4c0f', background: '#fcfaf8' }}>
          <div className="text-center" style={{ color: '#6b7280' }}>
            <p className="text-lg">💬</p>
            <p>Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}