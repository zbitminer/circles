import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import GalleryAlbumCard from '@/components/gallery/GalleryAlbumCard';

export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([base44.entities.GalleryAlbum.list('sort_order'), base44.entities.GalleryPhoto.list('sort_order')])
      .then(([albumData, photoData]) => {
        setAlbums(albumData);
        setPhotos(photoData);
        setSelectedId(albumData[0]?.id || null);
        setLoading(false);
      });
  }, []);

  const selected = albums.find(album => album.id === selectedId);
  const selectedPhotos = photos.filter(photo => photo.album_id === selectedId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-24">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">Image Gallery</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Moments of giving, connection, and community.</p>
      </div>
      {loading ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i => <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />)}</div> : albums.length === 0 ? <div className="rounded-2xl border border-border bg-card py-16 text-center text-muted-foreground">No galleries have been added yet.</div> : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{albums.map(album => <GalleryAlbumCard key={album.id} album={album} photos={photos.filter(photo => photo.album_id === album.id)} active={selectedId === album.id} onSelect={() => setSelectedId(album.id)} />)}</div>
          {selected && <section className="mt-12"><h2 className="font-heading text-2xl font-bold text-foreground">{selected.title}</h2>{selected.description && <p className="mt-2 text-muted-foreground">{selected.description}</p>}<div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{selectedPhotos.map(photo => <button key={photo.id} onClick={() => setLightbox(photo)} className="group overflow-hidden rounded-xl bg-muted text-left"><img src={photo.image_url} alt={photo.title || photo.caption || selected.title} className="aspect-square h-full w-full object-cover transition-transform group-hover:scale-105" /></button>)}</div>{selectedPhotos.length === 0 && <p className="mt-6 rounded-xl bg-muted p-8 text-center text-sm text-muted-foreground">No photos in this album yet.</p>}</section>}
        </>
      )}
      {lightbox && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4" onClick={() => setLightbox(null)}><button className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white" onClick={() => setLightbox(null)}><X className="h-6 w-6" /></button><figure className="max-h-full max-w-4xl" onClick={e => e.stopPropagation()}><img src={lightbox.image_url} alt={lightbox.title || lightbox.caption || 'Gallery photo'} className="max-h-[80vh] w-auto rounded-xl object-contain" />{(lightbox.title || lightbox.caption) && <figcaption className="mt-3 text-center text-white"><strong>{lightbox.title}</strong>{lightbox.caption && <span className="block text-sm text-white/75">{lightbox.caption}</span>}</figcaption>}</figure></div>}
    </div>
  );
}