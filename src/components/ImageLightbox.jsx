import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function ImageLightbox({ open, onOpenChange, src, alt, caption }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-2 sm:p-4 bg-card border border-border rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{alt || 'Image preview'}</DialogTitle>
          <DialogDescription>{caption || 'Full-size post image'}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3">
          <img
            src={src}
            alt={alt || 'Post image'}
            className="w-full max-h-[80vh] object-contain rounded-xl"
          />
          {caption && (
            <p className="text-sm font-medium text-foreground text-center px-2">{caption}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}