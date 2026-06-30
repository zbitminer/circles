import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, X, Search, MessageSquarePlus, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

export default function Messages({ currentUser, initialConversation }) {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewConv, setShowNewConv] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    setLoading(true);
    const allMessages = await base44.entities.Message.list('-created_date', 200);
    const convs = {};
    allMessages.forEach(msg => {
      const otherId = msg.from_user_id === currentUser.id ? msg.to_user_id : msg.from_user_id;
      const otherName = msg.from_user_id === currentUser.id ? msg.to_user_name : msg.from_user_name;
      if (!convs[otherId]) {
        convs[otherId] = { user_id: otherId, user_name: otherName, last_message: msg.content, conversation_id: msg.conversation_id, last_date: msg.created_date };
      }
    });
    setConversations(Object.values(convs).sort((a, b) => new Date(b.last_date) - new Date(a.last_date)));
    setLoading(false);
  };

  const loadMessages = async (convId) => {
    const msgs = await base44.entities.Message.filter({ conversation_id: convId }, '-created_date', 100);
    const reversed = msgs.reverse();
    setMessages(reversed);
    // Mark unread messages as read using updateMany (not bulkCreate which duplicates)
    const unreadIds = reversed.filter(m => m.to_user_id === currentUser.id && !m.is_read).map(m => m.id);
    if (unreadIds.length > 0) {
      await base44.entities.Message.updateMany(
        { conversation_id: convId, to_user_id: currentUser.id, is_read: false },
        { $set: { is_read: true } }
      ).catch(() => {});
    }
  };

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const profiles = await base44.entities.VolunteerProfile.list('-created_date', 50);
      const filtered = profiles.filter(p =>
        p.user_id !== currentUser.id &&
        (p.user?.full_name?.toLowerCase().includes(q.toLowerCase()) ||
         p.bio?.toLowerCase().includes(q.toLowerCase()) ||
         p.location?.toLowerCase().includes(q.toLowerCase()))
      );
      setSearchResults(filtered);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  };

  const startConversation = (profile) => {
    const conv = {
      user_id: profile.user_id,
      user_name: profile.user?.full_name || 'Volunteer',
      conversation_id: null
    };
    setSelected(conv);
    setShowNewConv(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selected) return;
    const convId = selected.conversation_id || [currentUser.id, selected.user_id].sort().join('-');
    await base44.entities.Message.create({
      from_user_id: currentUser.id,
      from_user_name: currentUser.full_name,
      to_user_id: selected.user_id,
      to_user_name: selected.user_name,
      content: newMessage,
      conversation_id: convId,
      is_read: false
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
    if (!selected.conversation_id) {
      setSelected({ ...selected, conversation_id: convId });
    }
    loadMessages(convId);
    loadConversations();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      {/* Conversation List */}
      <div className="border rounded-2xl overflow-hidden flex flex-col" style={{ borderColor: '#C9A84C', background: '#FAF7EE' }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#C9A84C' }}>
          <span className="font-semibold" style={{ color: '#1A2744' }}>Conversations</span>
          <button
            onClick={() => setShowNewConv(!showNewConv)}
            className="p-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: '#1A2744', color: '#F5E6C0' }}
            title="New conversation"
          >
            <MessageSquarePlus className="w-4 h-4" />
          </button>
        </div>

        {/* New conversation search */}
        {showNewConv && (
          <div className="p-3 border-b" style={{ borderColor: '#C9A84C' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6b5c3e' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search volunteers..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border outline-none text-sm"
                style={{ borderColor: '#C9A84C' }}
                autoFocus
              />
            </div>
            {searching && <p className="text-xs mt-2" style={{ color: '#6b5c3e' }}>Searching...</p>}
            {searchResults.length > 0 && (
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                {searchResults.map(profile => (
                  <button
                    key={profile.id}
                    onClick={() => startConversation(profile)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: '#1A2744' }}>
                      {initials(profile.user?.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#1A2744' }}>{profile.user?.full_name}</p>
                      {profile.location && <p className="text-xs truncate" style={{ color: '#6b5c3e' }}>{profile.location}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searchQuery && !searching && searchResults.length === 0 && (
              <p className="text-xs mt-2 text-center" style={{ color: '#6b5c3e' }}>No volunteers found</p>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm" style={{ color: '#6b5c3e' }}>Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-sm" style={{ color: '#6b5c3e' }}>
              No conversations yet.<br />Click <MessageSquarePlus className="inline w-3 h-3" /> to start one!
            </div>
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
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: '#1A2744' }}>
                    {initials(conv.user_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{conv.user_name}</p>
                    <p className="text-xs line-clamp-1" style={{ color: '#6b5c3e' }}>{conv.last_message}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat View */}
      {selected ? (
        <div className="md:col-span-2 border rounded-2xl overflow-hidden flex flex-col" style={{ borderColor: '#C9A84C', background: '#FAF7EE' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#C9A84C' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: '#1A2744' }}>
                {initials(selected.user_name)}
              </div>
              <span className="font-semibold" style={{ color: '#1A2744' }}>{selected.user_name}</span>
            </div>
            <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-black/5"><X className="w-4 h-4" style={{ color: '#1A2744' }} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center" style={{ color: '#6b5c3e' }}>
                <div>
                  <p className="text-lg mb-1">💬</p>
                  <p className="text-sm">Send the first message to start coordinating!</p>
                </div>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.from_user_id === currentUser.id ? 'items-end' : 'items-start'}`}>
                  <div
                    className="px-4 py-2 rounded-xl max-w-xs text-sm"
                    style={{
                      background: msg.from_user_id === currentUser.id ? '#1A2744' : '#e0d5be',
                      color: msg.from_user_id === currentUser.id ? '#F5E6C0' : '#1A2744'
                    }}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] mt-0.5 flex items-center gap-0.5" style={{ color: '#aaa' }}>
                    <Clock className="w-2.5 h-2.5" />{formatDistanceToNow(new Date(msg.created_date), { addSuffix: true })}
                  </span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t flex gap-2" style={{ borderColor: '#C9A84C' }}>
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-xl bg-white border outline-none text-sm"
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
            <p>Select a conversation or start a new one</p>
          </div>
        </div>
      )}
    </div>
  );
}