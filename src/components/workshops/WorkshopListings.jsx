import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, Calendar, Video, Users, Sparkles } from 'lucide-react';

const CATEGORY_EMOJI = {
  'Balanced Lifestyle': '🧘', 'Home Life Management': '🏠', 'Kitchen Academy': '🍳',
  'Artistic Space': '🎨', 'Language Learning': '🗣️', 'Torah Study': '📖',
  'Books': '📚', 'Music': '🎵', 'Personal Development': '✨', 'Miscellaneous': '🌟',
};

const CATEGORY_IMAGES = {
  'Balanced Lifestyle': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/9723845c3_generated_image.png',
  'Home Life Management': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/ec369b7d2_generated_image.png',
  'Kitchen Academy': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/814c0790b_generated_image.png',
  'Artistic Space': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/91add2711_generated_image.png',
  'Language Learning': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/bbe36e2f8_generated_image.png',
  'Torah Study': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/33eb124a6_generated_image.png',
  'Books': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/ea5e69f58_generated_image.png',
  'Music': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/763b81f67_generated_image.png',
  'Personal Development': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/6c541ae1f_generated_image.png',
  'Miscellaneous': 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/21c3c20d1_generated_image.png',
};

export default function WorkshopListings() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.WorkshopInquiry.list('-created_date', 50)
      .then((data) => setInquiries(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl p-5 animate-pulse h-40" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }} />
        ))}
      </div>
    );
  }

  if (inquiries.length === 0) return null;

  const leads = inquiries.filter((i) => i.inquiry_type === 'lead');
  const participants = inquiries.filter((i) => i.inquiry_type === 'participate');

  const parseCategory = (cat) => {
    const [main, sub] = (cat || '').split(':');
    return { main: main || cat, sub: sub || null };
  };

  const renderCard = (inq) => {
    const cats = (inq.workshop_categories || []).map(parseCategory).filter((c) => c.main);
    const mainCat = cats[0]?.main;
    return (
      <div key={inq.id} className="overflow-hidden transition-all hover:shadow-lg" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C', borderRadius: '12px' }}>
        {CATEGORY_IMAGES[mainCat] && (
          <div className="h-28 w-full overflow-hidden">
            <img src={CATEGORY_IMAGES[mainCat]} alt={mainCat} className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}
        <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-2xl">{CATEGORY_EMOJI[mainCat] || '🎓'}</span>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#f0e8d0', color: '#6b5c3e' }}>
            {inq.format === 'Both' ? 'In-person + Zoom' : inq.format}
          </span>
        </div>
        <h3 className="font-semibold mb-1" style={{ color: '#1A2744' }}>
          {inq.first_name} {inq.last_name}
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {cats.map((c, idx) => (
            <span key={idx} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#fff', color: '#6b5c3e', border: '1px solid #e0d5b0' }}>
              {c.sub ? `${c.sub}` : c.main}
            </span>
          ))}
        </div>
        {inq.location && (
          <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#888' }}>
            <MapPin className="w-3 h-3" style={{ color: '#C9A84C' }} /> {inq.location}
          </div>
        )}
        {inq.language && (
          <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#888' }}>
            <Sparkles className="w-3 h-3" style={{ color: '#C9A84C' }} /> {inq.language}{inq.other_language ? ` (${inq.other_language})` : ''}
          </div>
        )}
        {inq.workshop_date && (
          <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#888' }}>
            <Calendar className="w-3 h-3" style={{ color: '#C9A84C' }} /> {new Date(inq.workshop_date).toLocaleDateString('en-IL', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        )}
        {inq.zoom_link && (
          <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#888' }}>
            <Video className="w-3 h-3" style={{ color: '#C9A84C' }} /> Zoom available
          </div>
        )}
        {inq.notes && <p className="text-xs mt-2 line-clamp-2" style={{ color: '#6b5c3e' }}>{inq.notes}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {leads.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-bold mb-1 flex items-center gap-2" style={{ color: '#1A2744' }}>
            <Sparkles className="w-5 h-5" style={{ color: '#C9A84C' }} /> Upcoming Workshops
          </h2>
          <p className="text-sm mb-4" style={{ color: '#6b5c3e' }}>Workshops offered by community leaders</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leads.map(renderCard)}
          </div>
        </div>
      )}
      {participants.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-bold mb-1 flex items-center gap-2" style={{ color: '#1A2744' }}>
            <Users className="w-5 h-5" style={{ color: '#C9A84C' }} /> Community Interests
          </h2>
          <p className="text-sm mb-4" style={{ color: '#6b5c3e' }}>What community members want to learn</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {participants.map(renderCard)}
          </div>
        </div>
      )}
    </div>
  );
}