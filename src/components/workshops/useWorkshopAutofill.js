import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';

export default function useWorkshopAutofill(setForm) {
  const { user } = useAuth();
  const [applied, setApplied] = useState(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['workshop-signup-profile', user?.id],
    enabled: !!user,
    queryFn: () => base44.entities.VolunteerProfile.filter({ user_id: user.id }),
  });
  useEffect(() => {
    if (!user || applied === user.id || isLoading) return;
    const profile = data?.[0];
    const [first_name = '', ...rest] = (profile?.display_name || user.full_name || '').trim().split(/\s+/);
    const values = { first_name, last_name: rest.join(' '), email: user.email || '', phone: profile?.phone || '', location: profile?.location || '' };
    setForm(previous => Object.fromEntries(Object.entries({ ...previous }).map(([key, value]) => [key, value || values[key] || value])));
    setApplied(user.id);
  }, [user, data, isLoading, applied, setForm]);
  return { autofilling: !!user && isLoading, autofillError: isError };
}