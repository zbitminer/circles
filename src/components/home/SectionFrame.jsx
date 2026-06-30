export default function SectionFrame({ children, className = '', variant = 'light', padding = 'py-16 px-6' }) {
  const variants = {
    light: 'bg-card border border-border',
    muted: 'bg-muted/50 border border-border',
    white: 'bg-white border border-border shadow-sm',
    transparent: 'border border-border',
  };

  return (
    <section className={`max-w-5xl mx-auto rounded-2xl ${variants[variant]} ${padding} ${className}`}>
      {children}
    </section>
  );
}