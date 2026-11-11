import StarRating from './StarRating';
import { format } from 'date-fns';

export default function ReviewCard({ review }) {
  return (
    <div className="rounded-lg p-4" style={{ background: '#fbe8d4', border: '1px solid #f5a13c' }}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-sm" style={{ color: '#141414' }}>{review.reviewer_name}</p>
          <p className="text-xs" style={{ color: '#6b7280' }}>{format(new Date(review.created_date), 'MMM d, yyyy')}</p>
        </div>
        <StarRating rating={review.rating} readOnly />
      </div>
      <p className="text-sm" style={{ color: '#141414' }}>{review.content}</p>
    </div>
  );
}