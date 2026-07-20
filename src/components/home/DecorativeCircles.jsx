/**
 * Colorful, blurred circular accents used to enhance section backgrounds.
 * Purely decorative — sits behind content and ignores pointer events.
 */
export default function DecorativeCircles({ variant = 'light' }) {
  const circles =
    variant === 'dark'
      ? [
          { size: 260, top: '-60px', left: '-40px', color: 'rgba(217,93,26,0.30)' },
          { size: 200, bottom: '-70px', right: '-30px', color: 'rgba(36,125,125,0.30)' },
          { size: 120, top: '30%', right: '12%', color: 'rgba(201,151,56,0.28)' },
          { size: 90, bottom: '20%', left: '10%', color: 'rgba(255,255,255,0.10)' },
        ]
      : [
          { size: 280, top: '-80px', right: '-60px', color: 'rgba(217,93,26,0.16)' },
          { size: 220, bottom: '-90px', left: '-50px', color: 'rgba(36,125,125,0.16)' },
          { size: 140, top: '20%', left: '8%', color: 'rgba(201,151,56,0.16)' },
          { size: 100, bottom: '15%', right: '14%', color: 'rgba(217,93,26,0.12)' },
        ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {circles.map((c, i) => (
        <span
          key={i}
          className="absolute rounded-full blur-2xl"
          style={{
            width: c.size,
            height: c.size,
            top: c.top,
            bottom: c.bottom,
            left: c.left,
            right: c.right,
            background: c.color,
          }}
        />
      ))}
    </div>
  );
}