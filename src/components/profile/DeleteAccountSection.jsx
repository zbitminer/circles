import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DeleteAccountSection({ user, profileId }) {
  const [step, setStep] = useState(0); // 0 = closed, 1 = first confirm, 2 = final confirm
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    setBusy(true);
    try {
      if (profileId) await base44.entities.VolunteerProfile.delete(profileId).catch(() => {});
      await base44.entities.User.delete(user.id);
      base44.auth.logout('/');
    } catch (err) {
      alert(err?.message || 'Could not delete account. Please contact support.');
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl p-6 bg-card border border-destructive/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Danger Zone
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Permanently delete your account and volunteer profile.</p>
        </div>
        <Button variant="destructive" onClick={() => setStep(1)} className="inline-flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Delete Account
        </Button>
      </div>

      <Dialog open={step > 0} onOpenChange={(o) => !o && !busy && setStep(0)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{step === 1 ? 'Delete your account?' : 'Final confirmation'}</DialogTitle>
            <DialogDescription>
              {step === 1
                ? 'This will remove your volunteer profile and account access. Do you want to continue?'
                : 'Are you absolutely sure? This action is permanent and cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" disabled={busy} onClick={() => setStep(0)}>Cancel</Button>
            {step === 1 ? (
              <Button variant="destructive" onClick={() => setStep(2)}>Yes, continue</Button>
            ) : (
              <Button variant="destructive" disabled={busy} onClick={handleDelete}>
                {busy ? 'Deleting…' : 'Permanently Delete Account'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}