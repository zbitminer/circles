import { useEffect, useRef, useState } from 'react';
import { HeartHandshake, Loader2, Send, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import RequestAgentMessage from '@/components/agents/RequestAgentMessage';

const AGENT_NAME = 'request_filing_assistant';

export default function RequestAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [starting, setStarting] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => {
    if (!conversation?.id) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, data => setMessages(data.messages || []));
    return unsubscribe;
  }, [conversation?.id]);

  const startConversation = async () => {
    if (!user || conversation || starting) return;
    setStarting(true); setError('');
    try {
      const created = await base44.agents.createConversation({ agent_name: AGENT_NAME, metadata: { name: 'Support request', description: 'SOS or health request filing assistance' } });
      setConversation(created); setMessages(created.messages || []);
    } catch (err) { setError(err.message || 'The assistant could not start.'); }
    setStarting(false);
  };

  const toggle = () => { const next = !open; setOpen(next); if (next) startConversation(); };
  const send = async e => {
    e.preventDefault();
    const content = text.trim();
    if (!content || !conversation || sending) return;
    setSending(true); setError(''); setText('');
    try { await base44.agents.addMessage(conversation, { role: 'user', content }); }
    catch (err) { setError(err.message || 'Your message could not be sent.'); setText(content); }
    setSending(false);
  };

  return (
    <div className="fixed bottom-5 right-4 z-[65] sm:bottom-6 sm:right-6">
      {open && <section aria-label="Request filing assistant" className="mb-3 flex h-[min(34rem,calc(100vh-8rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <header className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-primary-foreground"><div className="flex items-center gap-2"><HeartHandshake className="h-5 w-5" /><div><h2 className="text-sm font-bold">Request Assistant</h2><p className="text-xs opacity-80">SOS & health support</p></div></div><button onClick={() => setOpen(false)} aria-label="Close assistant" className="rounded-lg p-1 hover:bg-primary-foreground/10"><X className="h-5 w-5" /></button></header>
        {!user ? <div className="flex flex-1 flex-col items-center justify-center p-6 text-center"><HeartHandshake className="mb-3 h-10 w-10 text-primary" /><p className="font-semibold">Sign in to file a request</p><p className="mt-1 text-sm text-muted-foreground">Your account is needed to securely submit an SOS or health request.</p><Link to="/login" className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Sign in</Link></div> : <><div className="flex-1 space-y-3 overflow-y-auto p-4">{starting && <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}{!starting && messages.length === 0 && <div className="rounded-2xl bg-muted p-4 text-sm"><p className="font-semibold">How can I help?</p><p className="mt-1 text-muted-foreground">Tell me what support is needed. I’ll ask a few short questions and let you review everything before filing.</p></div>}{messages.map((message, index) => <RequestAgentMessage key={message.id || index} message={message} />)}<div ref={bottomRef} /></div>{error && <p className="px-4 pb-2 text-xs text-destructive">{error}</p>}<form onSubmit={send} className="flex gap-2 border-t border-border p-3"><input value={text} onChange={e => setText(e.target.value)} disabled={!conversation || sending} placeholder="Describe the help needed…" className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" /><button disabled={!text.trim() || !conversation || sending} aria-label="Send message" className="rounded-xl bg-primary p-2.5 text-primary-foreground disabled:opacity-50">{sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}</button></form></>}
      </section>}
      <button onClick={toggle} aria-label={open ? 'Close request assistant' : 'Open request assistant'} className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"><HeartHandshake className="h-6 w-6" /></button>
    </div>
  );
}