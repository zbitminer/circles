import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';

export default function FilterBar({ activeCount = 0, children, className = '' }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex items-center justify-between gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium border transition-all"
        style={{
          background: open ? '#FAF7EE' : '#fff',
          borderColor: open || activeCount > 0 ? '#C9A84C' : '#e0e0e0',
          color: '#1A2744',
        }}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" style={{ color: '#C9A84C' }} />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: '#1A2744', color: '#F5E6C0' }}>
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: '#6b5c3e' }}
        />
      </button>

      {/* Desktop: always visible */}
      <div className={`${open ? 'block' : 'hidden'} md:block mt-3 md:mt-0`}>
        {children}
      </div>
    </div>
  );
}