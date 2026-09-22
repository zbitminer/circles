import { useEffect, useState } from 'react';
import { ImagePlus, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AlbumEditor from '@/components/gallery/AlbumEditor';
import PhotoEditor from '@/components/gallery/PhotoEditor';

export default function GalleryAdmin() {
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [albumTitle, setAlbumTitle] = useState('');
  const [photoForm, setPhotoForm] = useState({ album_id: '', title: '', caption: '', sort_order: 0 });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const load = async () => { const [a, p] = await Promise.all([base44.entities.GalleryAlbum.list('sort_order'), base44.entities.GalleryPhoto.list('sort_order')]); setAlbums(a); setPhotos(p); setPhotoForm(f => ({ ...f, album_id: f.album_id || a[0]?.id || '' })); };
  useEffect(() => { load(); }, []);

  const run = async action => { setError(''); try { await action(); return true; } catch (err) { setError(err.message || 'The gallery could not be updated.'); return false; } };
  const addAlbum = async e => { e.preventDefault(); if (await run(() => base44.entities.GalleryAlbum.create({ title: albumTitle, sort_order: albums.length }))) { setAlbumTitle(''); load(); } };
  const saveAlbum = async album => { if (await run(() => base44.entities.GalleryAlbum.update(album.id, { title: album.title, description: album.description, cover_image_url: album.cover_image_url, sort_order: album.sort_order }))) load(); };
  const deleteAlbum = async album => { if (!window.confirm(`Delete “${album.title}” and all its photos?`)) return; if (await run(async () => { await base44.entities.GalleryPhoto.deleteMany({ album_id: album.id }); await base44.entities.GalleryAlbum.delete(album.id); })) load(); };
  const uploadPhoto = async e => { e.preventDefault(); if (!file || !photoForm.album_id) return; setBusy(true); const saved = await run(async () => { const { file_url } = await base44.integrations.Core.UploadPublicFile({ file }); await base44.entities.GalleryPhoto.create({ ...photoForm, image_url: file_url, sort_order: Number(photoForm.sort_order) }); }); if (saved) { setFile(null); setPhotoForm(f => ({ ...f, title: '', caption: '', sort_order: photos.length })); load(); } setBusy(false); };
  const savePhoto = async photo => { if (await run(() => base44.entities.GalleryPhoto.update(photo.id, { album_id: photo.album_id, title: photo.title, caption: photo.caption, sort_order: photo.sort_order }))) load(); };
  const deletePhoto = async id => { if (!window.confirm('Delete this photo?')) return; if (await run(() => base44.entities.GalleryPhoto.delete(id))) load(); };

  return (
    <div className="space-y-8">
      {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <section><h2 className="mb-3 font-heading text-xl font-bold">Albums</h2><form onSubmit={addAlbum} className="mb-4 flex gap-2"><input required value={albumTitle} onChange={e => setAlbumTitle(e.target.value)} placeholder="New album title" className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm" /><button className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> Add album</button></form><div className="space-y-3">{albums.map(album => <AlbumEditor key={album.id} album={album} onSave={saveAlbum} onDelete={deleteAlbum} />)}{albums.length === 0 && <p className="rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">Create an album to begin.</p>}</div></section>
      <section><h2 className="mb-3 font-heading text-xl font-bold">Photos</h2><form onSubmit={uploadPhoto} className="mb-5 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-2"><select required value={photoForm.album_id} onChange={e => setPhotoForm({ ...photoForm, album_id: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm"><option value="">Choose album</option>{albums.map(album => <option key={album.id} value={album.id}>{album.title}</option>)}</select><input required type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" /><input value={photoForm.title} onChange={e => setPhotoForm({ ...photoForm, title: e.target.value })} placeholder="Photo title" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" /><input value={photoForm.caption} onChange={e => setPhotoForm({ ...photoForm, caption: e.target.value })} placeholder="Caption" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" /><button disabled={busy || !albums.length} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50 md:col-span-2"><ImagePlus className="h-4 w-4" /> {busy ? 'Uploading...' : 'Upload photo'}</button></form><div className="space-y-3">{photos.map(photo => <PhotoEditor key={photo.id} photo={photo} albums={albums} onSave={savePhoto} onDelete={deletePhoto} />)}</div></section>
    </div>
  );
}