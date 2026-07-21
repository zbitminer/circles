import { Link } from 'react-router-dom';
import { ShieldCheck, Clock } from 'lucide-react';

export default function SafeExplorationBanner({ location = 'your community', className = '' }) {
  return (
    <div
      className={`p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 ${className}`}
      style={{ background: '#F0F8F6', border: '1.5px solid #247D7D' }}
    >
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-full"
          style={{ background: 'rgba(36,125,125,0.12)' }}
        >
          <ShieldCheck className="w-5 h-5" style={{ color: '#247D7D' }} />
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-bold text-sm" style={{ color: '#1A1A1A' }}>
            Browse freely — every face is a verified member
          </p>
        </div>
        <p className="text-xs" style={{ color: '#555' }}>
          Explore opportunities from neighbors in {location} before you commit.{' '}
          <Link to="/register" className="font-bold hover:underline" style={{ color: '#247D7D' }}>
            Create a free account (30 seconds) →
          </Link>
        </p>
      </div>
      <Link
        to="/register"
        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
        style={{ background: '#247D7D', color: '#fff' }}
      >
        <Clock className="w-3.5 h-3.5" />
        Join free · 30 sec
      </Link>
    </div>
  );
}