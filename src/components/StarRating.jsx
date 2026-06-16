import { Star } from 'lucide-react';

export default function StarRating({ rating, onRate, readOnly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          onClick={() => !readOnly && onRate?.(i)}
          className="transition-all hover:scale-110"
          disabled={readOnly}
        >
          <Star
            className="w-4 h-4"
            fill={i <= rating ? '#C9A84C' : 'none'}
            style={{ color: i <= rating ? '#C9A84C' : '#ddd' }}
          />
        </button>
      ))}
    </div>
  );
}