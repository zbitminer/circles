import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

export default function ContentImageDetails({ image, alt, imageClassName, className = 'block w-full text-left', title, description, children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={`${className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`} aria-label={`Open ${title}`}>
          <img src={image} alt={alt || title} className={imageClassName} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-xl">
        <DialogHeader className="pr-6">
          <DialogTitle className="break-words leading-snug">{title}</DialogTitle>
          <DialogDescription className={description ? '' : 'sr-only'}>{description || 'Content details'}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}