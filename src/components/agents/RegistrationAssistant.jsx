import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import OpportunityAgentMessage from '@/components/agents/OpportunityAgentMessage';

export default function RegistrationAssistant({ currentStep }) {
  const [open, setOpen] = useState(false), [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]), [text, setText] = useState(''), [sending, setSending] = useState(false), [error, setError] = useState('');
  const bottomRef = useRef(null);
  useEffect(() => {
    if (!conversation?.id) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, data => setMessages(data.messages || []));
    return unsubscribe;
  }, [conversation?.id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const send = async e => {
    e?.preventDefault(); const content = text.trim(); if (!content || sending) return;
    setSending(true); setError(''); setText('');
    try {
      let active = conversation;
      if (!active) { active = await base44.agents.createConversation({ agent_name: 'registration_assistant', metadata: { name: 'Registration help', current_step: currentStep } }); setConversation(active); setMessages(active.messages || []); }
      await base44.agents.addMessage(active, { role: 'user', content });
    } catch (err) { setError(err.message || 'Registration help is temporarily unavailable.'); setText(content); }
    setSending(false);
  };
  if (!open) return <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-lg"><Bot className="h-5 w-5" /> Registration help</button>;
  return <aside className="fixed bottom-5 right-5 z-50 flex h-[32rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"><header className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground"><div><p className="font-semibold">Registration Assistant</p><p className="text-xs opacity-80">Help with step {currentStep} of 4</p></div><button onClick={() => setOpen(false)} aria-label="Close registration help"><X className="h-5 w-5" /></button></header><div className="flex-1 space-y-3 overflow-y-auto p-4"><div className="rounded-2xl bg-muted px-3.5 py-2.5 text-sm text-foreground">Hi! Ask me about this signup step. Please never share your password or verification code here.</div>{messages.map((message, index) => <OpportunityAgentMessage key={message.id || index} message={message} />)}<div ref={bottomRef} /></div>{error && <p className="px-4 pb-2 text-xs text-destructive">{error}</p>}<form onSubmit={send} className="flex gap-2 border-t border-border p-3"><input value={text} onChange={e => setText(e.target.value)} placeholder="Ask about registration…" className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" /><button disabled={!text.trim() || sending} aria-label="Send" className="rounded-xl bg-primary p-2.5 text-primary-foreground disabled:opacity-50">{sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}</button></form></aside>;
}