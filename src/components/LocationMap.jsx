import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Geocode a location string via Nominatim (free, no key needed)
const geocodeCache = {};
async function geocode(location) {
  if (!location || location.toLowerCase().includes('remote') || location.toLowerCase().includes('virtual')) return null;
  if (geocodeCache[location]) return geocodeCache[location];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data[0]) {
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      geocodeCache[location] = coords;
      return coords;
    }
  } catch {
    // silently skip
  }
  return null;
}

function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    if (markers.length === 1) {
      map.setView([markers[0].coords.lat, markers[0].coords.lng], 13);
    } else {
      const bounds = L.latLngBounds(markers.map(m => [m.coords.lat, m.coords.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [markers, map]);
  return null;
}

export default function LocationMap({ items = [], onSelectItem, labelKey = 'title', locationKey = 'location' }) {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const unique = {};
    items.forEach(item => {
      const loc = item[locationKey];
      if (loc) unique[loc] = unique[loc] || [];
      if (loc) unique[loc].push(item);
    });

    Promise.all(
      Object.entries(unique).map(async ([loc, group]) => {
        const coords = await geocode(loc);
        return coords ? { coords, group, loc } : null;
      })
    ).then(results => {
      if (!cancelled) {
        setMarkers(results.filter(Boolean));
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [items, locationKey]);

  if (loading) {
    return (
      <div className="w-full h-[420px] bg-muted rounded-2xl border border-border flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm">Loading map…</p>
        </div>
      </div>
    );
  }

  if (markers.length === 0) {
    return (
      <div className="w-full h-[420px] bg-muted rounded-2xl border border-border flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-sm">No mappable locations found.<br />Locations like "Remote" won't appear on the map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[280px] rounded-2xl border border-border overflow-hidden">
      <MapContainer center={[31.5, 35.0]} zoom={7} zoomAnimation={false} style={{ width: '100%', height: '100%' }} scrollWheelZoom={false}>
        <FitBounds markers={markers} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map(({ coords, group, loc }, i) => (
          <Marker key={i} position={[coords.lat, coords.lng]}>
            <Popup>
              <div className="max-w-[200px] space-y-2">
                <p className="text-xs font-semibold text-gray-500">{loc}</p>
                {group.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onSelectItem?.(item)}
                    className="block w-full text-left text-sm font-medium text-blue-600 hover:underline"
                  >
                    {item[labelKey]}
                  </button>
                ))}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}