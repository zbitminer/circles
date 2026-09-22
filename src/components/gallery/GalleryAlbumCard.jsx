export default function GalleryAlbumCard({ album, photos, active, onSelect }) {
  const cover = album.cover_image_url || photos[0]?.image_url;

  return (
    <button
      onClick={onSelect}
      className={`overflow-hidden rounded-2xl border text-left transition-all ${active ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:shadow-md'}`}
    >
      <div className="aspect-[4/3] bg-muted">
        {cover ? <img src={cover} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No photos yet</div>}
      </div>
      <div className="bg-card p-4">
        <h2 className="font-heading text-lg font-bold text-card-foreground">{album.title}</h2>
        {album.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{album.description}</p>}
        <p className="mt-2 text-xs text-muted-foreground">{photos.length} {photos.length === 1 ? 'photo' : 'photos'}</p>
      </div>
    </button>
  );
}