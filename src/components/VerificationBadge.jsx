import React from 'react';
import { BadgeCheck } from 'lucide-react';

/**
 * Shows a verification badge next to a user's name.
 * Verified = 50+ hours OR 10+ opportunities completed OR admin role.
 */
export default function VerificationBadge({ profile, user, size = 'sm' }) {
  const isVerified =
    (profile?.total_hours >= 50) ||
    (profile?.opportunities_completed >= 10) ||
    (user?.role === 'admin');

  if (!isVerified) return null;

  const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';

  return (
    <span
      title="Verified Community Member"
      className={`inline-flex items-center gap-0.5 ${size === 'lg' ? 'text-sm' : 'text-xs'} text-blue-500`}
    >
      <BadgeCheck className={iconSize} fill="currentColor" />
      {size === 'lg' && <span className="font-medium">Verified</span>}
    </span>
  );
}