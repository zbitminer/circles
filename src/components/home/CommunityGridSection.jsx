import { Link } from 'react-router-dom';

const MEMBERS = [
  {
    img: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/afe5518a3_generated_image.png',
    caption: 'Rivka · Jerusalem',
    tag: 'MENTOR',
    tagBg: '#FBBF24',
    tagColor: '#1A1A1A',
    large: true,
  },
  {
    img: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/7b12843e1_generated_image.png',
    caption: 'Devorah · Tel Aviv',
    large: false,
  },
  {
    img: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/af83a5bc6_generated_image.png',
    caption: 'Evening Circle · Haifa',
    large: false,
  },
  {
    img: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/5b2d8c9dc_generated_image.png',
    caption: 'Shira · Jerusalem',
    large: false,
  },
  {
    img: 'https://media.base44.com/images/public/6a2feeb0292b105992c98be7/fae5a9a9d_generated_image.png',
    caption: 'Nava & Sara · Beersheva',
    large: false,
  },
];

const JOINED_AVATARS = ['R', 'E', 'S', 'M', 'Y'];
const JOINED_COLORS = ['#3498DB', '#E74C3C', '#2ECC71', '#9B59B6', '#E67E22'];

export default function CommunityGridSection() {
  const large = MEMBERS[0];
  const smalls = MEMBERS.slice(1);

  return (
    <section style={{ background: '#F9F9F9' }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: '#5A5A5A' }}>
            COMMUNITY
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1A1A1A', fontFamily: 'Georgia, serif' }}>
            Real people. Real giving.
          </h2>
          <p className="text-base" style={{ color: '#404040' }}>
            Every face you see is a verified member — a neighbour, a mentor, a friend you haven't met yet.
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large photo */}
          <div className="relative rounded-2xl overflow-hidden md:row-span-2 h-64 md:h-full min-h-[300px]">
            <img src={large.img} alt={large.caption} className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              {large.tag && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ background: large.tagBg, color: large.tagColor }}>
                  {large.tag}
                </span>
              )}
              <span className="text-xs font-semibold text-white bg-black/40 px-2 py-0.5 rounded">{large.caption}</span>
            </div>
          </div>

          {/* Small photos */}
          {smalls.map((m) => (
            <div key={m.caption} className="relative rounded-2xl overflow-hidden h-40">
              <img src={m.img} alt={m.caption} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2">
                <span className="text-xs font-semibold text-white bg-black/40 px-2 py-0.5 rounded">{m.caption}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Joined this week bar */}
        <div className="flex items-center gap-3 mt-8 flex-wrap">
          <div className="flex -space-x-2">
            {JOINED_AVATARS.map((letter, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: JOINED_COLORS[i], border: '2px solid #fff' }}
              >
                {letter}
              </div>
            ))}
          </div>
          <span className="text-sm" style={{ color: '#6b5c3e' }}>
            Joined this week: <strong>Rivka, Eitan, Shira</strong> + 12 more
          </span>
          <Link to="/directory" className="ml-auto text-sm font-bold hover:underline" style={{ color: '#D95D1A' }}>
            Browse all members →
          </Link>
        </div>
      </div>
    </section>
  );
}