import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

export default function RegistrationPrompt({ user }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    if (user || sessionStorage.getItem('registration-prompt-dismissed')) return;
    const timer = window.setTimeout(() => setOpen(true), 10000);
    return () => window.clearTimeout(timer);
  }, [pathname, user]);

  if (!open || user) return null;

  const dismiss = () => {
    sessionStorage.setItem('registration-prompt-dismissed', 'true');
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 p-4" role="dialog" aria-modal="true" aria-labelledby="registration-title">
      <div className="relative w-full max-w-md rounded-2xl bg-card p-7 text-center shadow-2xl">
        <button onClick={dismiss} aria-label="Close registration prompt" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
          <X className="h-5 w-5" />
        </button>
        <h2 id="registration-title" className="pr-8 text-2xl font-bold text-foreground">Join the Circle</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">Register to connect with neighbors, join events, and take part in the community.</p>
        <Link to="/register" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring">Register Now</Link>
      </div>
    </div>
  );
}