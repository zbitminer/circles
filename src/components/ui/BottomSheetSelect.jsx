import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function BottomSheetSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  label = 'Select option',
  className = '',
  style,
}) {
  const [open, setOpen] = useState(false);
  const normalized = options.map((o) =>
    typeof o === 'object' && o !== null ? { value: o.value, label: o.label ?? String(o.value) } : { value: o, label: String(o) }
  );
  const current = normalized.find((o) => String(o.value) === String(value));

  const handlePick = (val) => {
    onChange?.({ target: { value: val } });
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={style}
        className={`flex items-center justify-between gap-2 text-left ${className || 'w-full bg-muted rounded-xl px-4 py-3 text-sm border border-transparent focus:border-primary/30'}`}
      >
        <span className={current ? 'text-foreground truncate' : 'text-muted-foreground truncate'}>
          {current ? current.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="fixed inset-x-0 bottom-0 top-auto left-0 translate-x-0 translate-y-0 sm:left-[50%] sm:top-[50%] sm:bottom-auto sm:translate-x-[-50%] sm:translate-y-[-50%] w-full max-w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-4 pb-[calc(1rem+var(--safe-area-bottom,0px))] max-h-[80vh] overflow-y-auto">
          <div className="w-10 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-2 sm:hidden" />
          <DialogHeader>
            <DialogTitle className="text-base">{label}</DialogTitle>
            <DialogDescription className="sr-only">Choose an option from the list below.</DialogDescription>
          </DialogHeader>
          <div className="mt-2 divide-y divide-border">
            {normalized.map((opt) => {
              const selected = String(opt.value) === String(value);
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => handlePick(opt.value)}
                  className={`w-full flex items-center justify-between px-3 py-3 text-sm rounded-xl transition-colors ${
                    selected ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span>{opt.label}</span>
                  {selected && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}