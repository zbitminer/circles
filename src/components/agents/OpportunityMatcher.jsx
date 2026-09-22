import { useEffect, useRef, useState } from 'react';
import { BriefcaseBusiness, Loader2, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import OpportunityAgentMessage from '@/components/agents/OpportunityAgentMessage';

const AGENT_NAME = 'opportunity_matcher';
const INITIAL_PROMPT = 'Please review my volunteer profile and recommend the active opportunities that fit me best.';

export default function OpportunityMatcher() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [starting, setStarting] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!conversation?.id) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, data => setMessages(data.messages || []));
    return unsubscribe;
  }, [conversation?.id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const findMatches = async () => {
    if (conversation || starting) return;
    setStarting(true); setError('');
    try {
      const created = await base44.agents.createConversation({ agent_name: AGENT_NAME, metadata: { name: 'Opportunity matches', description: 'Recommendations based on my volunteer profile' } });
      setConversation(created); setMessages(created.messages || []);
      await base44.agents.addMessage(created, { role: 'user', content: INITIAL_PROMPT });
    } catch (err) { setError(err.message || 'Recommendations could not be started.'); }
    setStarting(false);
  };

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
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><div className="rounded-xl bg-primary/10 p-2.5"><BriefcaseBusiness className="h-5 w-5 text-primary" /></div><div><h2 className="font-heading text-xl font-bold text-card-foreground">Opportunity Match Assistant</h2><p className="mt-1 text-sm text-muted-foreground">Get personalized suggestions based on your causes, location, and profile.</p></div></div>{!conversation && <button onClick={findMatches} disabled={starting} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{starting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{starting ? 'Finding matches…' : 'Find my matches'}</button>}</div>
      {(conversation || starting || error) && <div className="border-t border-border"><div className="max-h-96 space-y-3 overflow-y-auto p-4">{starting && messages.length === 0 && <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin text-primary" /> Reviewing your profile and active listings…</div>}{messages.map((message, index) => <OpportunityAgentMessage key={message.id || index} message={message} />)}<div ref={bottomRef} /></div>{error && <p className="px-4 pb-3 text-xs text-destructive">{error}</p>}{conversation && <><form onSubmit={send} className="flex gap-2 border-t border-border p-3"><input value={text} onChange={e => setText(e.target.value)} disabled={sending} placeholder="Refine by schedule, location, or interests…" className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" /><button disabled={!text.trim() || sending} aria-label="Send message" className="rounded-xl bg-primary p-2.5 text-primary-foreground disabled:opacity-50">{sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}</button></form><div className="border-t border-border px-4 py-3 text-right"><Link to="/opportunities" className="text-sm font-semibold text-primary hover:underline">Browse all opportunities →</Link></div></>}</div>}
    </section>
  );
}