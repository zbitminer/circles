import { Link } from 'react-router-dom';
import { ShieldCheck, Clock } from 'lucide-react';

export default function SafeExplorationBanner({ location = 'Safed, Israel', className = '' }) {
  return (
    <div
      className={`p-4 rounded-xl border border-primary bg-secondary flex flex-col sm:flex-row items-start sm:items-center gap-3 ${className}`}
    >
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10"
        >
          <ShieldCheck className="w-5 h-5 text-primary" />
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-bold text-sm text-foreground">
            Browse freely — every face is a verified member
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Explore opportunities from neighbors in {location} before you commit.{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Create a free account (30 seconds) →
          </Link>
        </p>
      </div>
      <Link
        to="/register"
        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0 bg-primary text-primary-foreground"
      >
        <Clock className="w-3.5 h-3.5" />
        Join free · 30 sec
      </Link>
    </div>
  );
}