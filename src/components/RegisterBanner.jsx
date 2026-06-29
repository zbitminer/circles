import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function RegisterBanner() {
  return (
    <div className="w-full" style={{ background: '#D95D1A' }}>
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-center">
        <p className="text-sm font-semibold text-white">
          Join the Circle — it's free.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-1.5 rounded-full bg-white hover:bg-white/90 transition-colors whitespace-nowrap"
          style={{ color: '#D95D1A' }}
        >
          Register Now <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}