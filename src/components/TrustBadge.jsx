import { ShieldCheck } from 'lucide-react';

export default function TrustBadge({ text = 'Verified Members', className = '', color = '#247D7D' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}
      style={{ background: `${color}1A`, color }}
    >
      <ShieldCheck className="w-3.5 h-3.5" />
      {text}
    </span>
  );
}