export default function WorkshopMap({ workshop }) {
  if (workshop.format === 'Zoom') return null;
  const address = [workshop.has_studio ? workshop.studio_address || workshop.location : workshop.location, workshop.city].filter(Boolean).join(', ');
  if (!address) return null;
  const query = encodeURIComponent(address);
  return <details className="rounded-xl border border-border p-3">
    <summary className="cursor-pointer text-sm font-medium text-primary">View location on map — {address}</summary>
    <iframe title={`Map: ${address}`} src={`https://maps.google.com/maps?q=${query}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="mt-3 h-64 w-full rounded-lg border-0" />
    <a className="mt-2 inline-block text-sm text-primary underline" href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer">Open directions</a>
  </details>;
}