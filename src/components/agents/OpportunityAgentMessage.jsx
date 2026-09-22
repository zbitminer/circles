import ReactMarkdown from 'react-markdown';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

function ToolStatus({ tool }) {
  const active = ['pending', 'running', 'in_progress'].includes(tool.status);
  const failed = ['failed', 'error'].includes(tool.status);
  const Icon = failed ? XCircle : active ? Loader2 : CheckCircle2;
  const label = failed ? 'Could not check matches' : active ? 'Checking profile and listings…' : 'Matches checked';
  return <div className={`mt-2 flex items-center gap-1.5 text-xs ${failed ? 'text-destructive' : 'text-muted-foreground'}`}><Icon className={`h-3.5 w-3.5 ${active ? 'animate-spin' : ''}`} />{label}</div>;
}

export default function OpportunityAgentMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
        {message.content && (isUser ? <p className="whitespace-pre-wrap">{message.content}</p> : <ReactMarkdown className="prose prose-sm max-w-none text-foreground">{message.content}</ReactMarkdown>)}
        {message.tool_calls?.map((tool, index) => <ToolStatus key={index} tool={tool} />)}
      </div>
    </div>
  );
}